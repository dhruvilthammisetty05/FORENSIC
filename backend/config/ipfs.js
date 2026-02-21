const { create } = require('ipfs-http-client');

let ipfs;

try {
    const ipfsUrl = process.env.IPFS_URL || 'http://localhost:5001';
    ipfs = create({ url: ipfsUrl });
    console.log(`IPFS Client initialized at ${ipfsUrl}`);
} catch (error) {
    console.error('IPFS Client initialization failed:', error.message);
}

module.exports = ipfs;
