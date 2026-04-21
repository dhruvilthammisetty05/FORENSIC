const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/authMiddleware');
const ipfs = require('../config/ipfs');
const { getWeb3, getContract } = require('../config/web3');
const Evidence = require('../models/Evidence');
const Log = require('../models/Log');
const User = require('../models/User');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const NodeClam = require('clamscan');
let clamscan = null;
new NodeClam().init({
    clamdscan: {
        host: 'clamav',
        port: 3310,
        timeout: 60000,
        local_fallback: false,
    }
}).then(cs => {
    clamscan = cs;
    console.log("ClamAV virus scanner connection established.");
}).catch(err => {
    console.error("ClamAV initialization failed: ", err);
});

// @desc    Upload evidence
// @route   POST /api/evidence/upload
// @access  Private (Investigator, Officer, Admin)
router.post('/upload', protect, authorize('Investigator', 'Officer', 'Admin'), upload.single('file'), async (req, res) => {
    try {
        const { caseId, role } = req.body;
        const file = req.file;

        if (!file || !caseId || !role) {
            return res.status(400).json({ message: 'Please provide file, caseId, and role' });
        }

        const web3 = getWeb3();
        const contract = getContract();

        if (!web3 || !contract) {
            return res.status(503).json({ message: 'Blockchain network unavailable. Contract not loaded.' });
        }

        // 0. Perform automated ClamAV Virus Scan
        if (clamscan) {
            try {
                const { is_infected, viruses } = await clamscan.scanBuffer(file.buffer);
                if (is_infected) {
                    await Log.create({ action: 'EVIDENCE_VIRUS_DETECTED', level: 'CRITICAL', details: `Malware detected in upload attempt to Case ${caseId}. Viruses: ${viruses.join(', ')}`, user: req.user._id });
                    return res.status(403).json({ message: 'UPLOAD REJECTED: Security system detected malicious signature in file.' });
                }
            } catch (scanErr) {
                console.error("Clam scan error:", scanErr);
            }
        }

        // 1. Compute SHA256 hash
        const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

        // 2. Upload to IPFS
        const ipfsResult = await ipfs.add(file.buffer);
        const ipfsHash = ipfsResult.path;

        // 3. Store on Blockchain
        const accounts = await web3.eth.getAccounts();
        const uploaderAccount = accounts[0]; // For dev, use Ganache's first account. In prod, integration with wallet API is needed.

        // Generate a unique incremental Evidence ID
        const evidenceCount = await Evidence.countDocuments();
        const evidenceId = evidenceCount + 1;

        const tx = await contract.methods.storeEvidence(evidenceId, hash, caseId, role)
            .send({ from: uploaderAccount, gas: 3000000 });

        const txHash = tx.transactionHash;

        // 4. Store metadata in MongoDB
        const evidence = await Evidence.create({
            caseId,
            uploaderId: req.user._id,
            role,
            ipfsHash,
            sha256Hash: hash,
            txHash,
            evidenceId
        });

        await Log.create({ action: 'EVIDENCE_UPLOAD', level: 'INFO', details: `Evidence ${evidence.evidenceId} uploaded to Case ${caseId}`, user: req.user._id });

        res.status(201).json({
            message: 'Evidence successfully uploaded',
            evidenceId: evidence.evidenceId,
            ipfsHash: evidence.ipfsHash,
            txHash: evidence.txHash,
            sha256Hash: evidence.sha256Hash
        });

    } catch (error) {
        console.error('Evidence upload error:', error);
        res.status(500).json({ message: error.message || 'Evidence upload failed' });
    }
});

// @desc    Verify evidence integrity
// @route   GET /api/evidence/verify/:id
// @access  Private
router.get('/verify/:id', protect, async (req, res) => {
    try {
        const evidenceId = parseInt(req.params.id);

        const contract = getContract();
        if (!contract) {
            return res.status(503).json({ message: 'Blockchain network unavailable.' });
        }

        // Fetch from Document DB
        const evidenceRecord = await Evidence.findOne({ evidenceId });

        if (!evidenceRecord) {
            return res.status(404).json({ message: 'Evidence not found in database' });
        }

        // Fetch from Blockchain
        let blockchainRecord;
        try {
            blockchainRecord = await contract.methods.getEvidence(evidenceId).call();
        } catch (bcError) {
            return res.status(404).json({ message: 'Evidence not found on the blockchain' });
        }

        const isHashValid = evidenceRecord.sha256Hash === blockchainRecord.fileHash;
        const isCaseIdValid = evidenceRecord.caseId === blockchainRecord.caseId;

        if (isHashValid && isCaseIdValid) {
            res.status(200).json({ status: 'VALID', message: 'Evidence is authentic and unaltered' });
        } else {
            res.status(200).json({ status: 'TAMPERED', message: 'WARNING: Evidence integrity validation failed' });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    List all evidence
// @route   GET /api/evidence/list
// @access  Private
router.get('/list', protect, async (req, res) => {
    try {
        // Find evidence and populate uploader details optionally
        const evidenceList = await Evidence.find({}).sort({ createdAt: -1 }).select('caseId role txHash createdAt evidenceId sha256Hash ipfsHash');

        res.status(200).json(evidenceList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Get dashboard statistics
// @route   GET /api/evidence/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const totalEvidence = await Evidence.countDocuments();

        // For the sake of the dashboard demo, we return total counts and mock flags 
        // since we aren't storing 'tampered' status persistently without full re-verification.

        // Let's get the 5 most recently uploaded evidence as part of the "timeline"
        const recentTimeline = await Evidence.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('caseId role txHash createdAt evidenceId ipfsHash');

        res.status(200).json({
            totalEvidence,
            verifiedEvidence: totalEvidence,
            tamperedAlerts: 0,
            recentActivity: recentTimeline
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Initiate Custody Transfer (Multi-Sig Part 1)
// @route   POST /api/evidence/:id/transfer/initiate
// @access  Private
router.post('/:id/transfer/initiate', protect, async (req, res) => {
    try {
        const evidence = await Evidence.findOne({ evidenceId: parseInt(req.params.id) });
        if (!evidence) return res.status(404).json({ message: 'Evidence not found' });

        const { toEmail, notes } = req.body;
        const targetUser = await User.findOne({ email: toEmail });
        
        if (!targetUser) return res.status(404).json({ message: 'Target user email not found' });

        evidence.pendingTransfers.push({
            fromId: req.user._id,
            toId: targetUser._id,
            toEmail,
            notes,
            status: 'Pending'
        });

        await evidence.save();
        await Log.create({ action: 'CUSTODY_TRANSFER_INITIATED', level: 'INFO', details: `Transfer initiated for Evidence ${evidence.evidenceId} to ${toEmail}`, user: req.user._id });

        res.status(200).json({ message: 'Custody transfer initiated and waiting for approval.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve Custody Transfer (Multi-Sig Part 2)
// @route   POST /api/evidence/:id/transfer/approve
// @access  Private
router.post('/:id/transfer/approve', protect, async (req, res) => {
    try {
        const evidence = await Evidence.findOne({ evidenceId: parseInt(req.params.id) });
        if (!evidence) return res.status(404).json({ message: 'Evidence not found' });

        // Find pending transfer where the current logged in user is the target
        const pendingIndex = evidence.pendingTransfers.findIndex(t => t.toId.toString() === req.user._id.toString() && t.status === 'Pending');
        
        if (pendingIndex === -1) {
            return res.status(400).json({ message: 'No pending transfers found for your account on this evidence.' });
        }

        // Approve it!
        evidence.pendingTransfers[pendingIndex].status = 'Approved';
        
        // Log to official custody history
        evidence.custodyHistory.push({
            handlerId: req.user._id,
            handlerName: req.user.name,
            action: 'ASSUMED_CUSTODY',
            notes: evidence.pendingTransfers[pendingIndex].notes
        });

        await evidence.save();
        await Log.create({ action: 'CUSTODY_TRANSFER_APPROVED', level: 'INFO', details: `${req.user.name} assumed custody of Evidence ${evidence.evidenceId}`, user: req.user._id });

        res.status(200).json({ message: 'Transfer formally approved. You are now the official custodian.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's pending incoming custody transfers
// @route   GET /api/evidence/pending-transfers
// @access  Private
router.get('/pending-transfers/me', protect, async (req, res) => {
    try {
        const evidenceWithTransfers = await Evidence.find({
            "pendingTransfers.toId": req.user._id,
            "pendingTransfers.status": "Pending"
        }).populate('pendingTransfers.fromId', 'name email');

        // Filter and map to send only the user's pending transfers
        const myPending = [];
        evidenceWithTransfers.forEach(ev => {
            ev.pendingTransfers.forEach(t => {
                if (t.toId.toString() === req.user._id.toString() && t.status === 'Pending') {
                    myPending.push({
                        evidenceId: ev.evidenceId,
                        caseId: ev.caseId,
                        fromName: t.fromId.name,
                        fromEmail: t.fromId.email,
                        initiatedAt: t.initiatedAt,
                        notes: t.notes
                    });
                }
            });
        });

        res.status(200).json(myPending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
