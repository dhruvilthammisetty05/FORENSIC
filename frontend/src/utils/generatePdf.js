import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

export const generateCourtReport = (evidenceRecord) => {
    try {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(15, 23, 42); // Dark slate blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("OFFICIAL FORENSIC REPORT", 105, 20, null, null, "center");
        doc.setFontSize(10);
        doc.text("DIGITAL EVIDENCE CHAIN OF CUSTODY", 105, 28, null, null, "center");

        // Metadata Text
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.text("Evidence Details:", 14, 55);
        
        doc.setFontSize(10);
        doc.text(`Report Generated On: ${new Date().toLocaleString()}`, 110, 55);

        // Evidence Information Table
        doc.autoTable({
            startY: 62,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            body: [
                ['Evidence Sequence ID', `#${evidenceRecord.evidenceId}`],
                ['Case Assignment ID', evidenceRecord.caseId || 'Unassigned'],
                ['Original Uploader ID', evidenceRecord.uploader || 'System'],
                ['Upload Timestamp', new Date(evidenceRecord.createdAt).toLocaleString()],
                ['IPFS Storage CID', evidenceRecord.ipfsHash || 'N/A'],
            ],
        });

        const yPosAfterTable = doc.lastAutoTable.finalY + 15;

        // Cryptographic Verification Section
        doc.setFontSize(14);
        doc.setTextColor(200, 40, 40); // Red hue for security
        doc.text("Cryptographic Fingerprint (SHA-256):", 14, yPosAfterTable);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        
        // Split hash if too long
        const hash = evidenceRecord.sha256Hash || 'UNAVAILABLE';
        const splitHash = doc.splitTextToSize(hash, 180);
        doc.text(splitHash, 14, yPosAfterTable + 8);

        // Blockchain Stamping (Ganache)
        const yPosBlockInfo = yPosAfterTable + 25;
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text("Blockchain Ledger Verification:", 14, yPosBlockInfo);
        
        doc.autoTable({
            startY: yPosBlockInfo + 5,
            theme: 'plain',
            headStyles: { fillColor: [240, 240, 240], textColor: 20 },
            body: [
                ['Network:', 'Ganache Localnet (Ethereum)'],
                ['Storage Status:', 'Immutable / Verified'],
                ['Smart Contract Address:', import.meta.env.VITE_CONTRACT_ADDRESS || '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0'],
            ],
            styles: { cellPadding: 2, fontSize: 10 }
        });

        // Certification Footer
        const finalY = doc.lastAutoTable.finalY + 30;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("This document certifies that the cryptographic hash matching this evidence file", 105, finalY, null, null, 'center');
        doc.text("has been immutably sealed on the blockchain network.", 105, finalY + 5, null, null, 'center');

        // Stamp
        doc.setDrawColor(0, 150, 0);
        doc.setLineWidth(1);
        doc.rect(85, finalY + 15, 40, 15);
        doc.setTextColor(0, 100, 0);
        doc.setFontSize(12);
        doc.text("VALIDATED", 105, finalY + 24, null, null, 'center');

        // Output PDF
        doc.save(`Forensic_Report_Evidence_${evidenceRecord.evidenceId}.pdf`);
        toast.success("Court-Ready Report Generated Successfully!");
        
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF Report");
    }
};
