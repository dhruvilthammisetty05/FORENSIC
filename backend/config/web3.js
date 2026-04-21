const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

let web3;
let contract;

const initWeb3 = async () => {
    try {
        const blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545';
        const maxRetries = 30;
        let retries = 0;

        // Retry logic to wait for blockchain to be ready
        while (retries < maxRetries) {
            try {
                web3 = new Web3(blockchainUrl);
                const isConnected = await web3.eth.net.isListening();
                
                if (isConnected) {
                    console.log('✅ Connected to blockchain at:', blockchainUrl);
                    break;
                }
            } catch (error) {
                retries++;
                if (retries < maxRetries) {
                    console.log(`⏳ Waiting for blockchain... (attempt ${retries}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        if (retries >= maxRetries) {
            console.error('❌ Failed to connect to blockchain after', maxRetries, 'attempts');
            return { web3: null, contract: null };
        }

        // Load contract ABI
        const contractPath = path.resolve(process.cwd(), process.env.CONTRACT_ADDRESS_PATH || '../blockchain/build/contracts/EvidenceChain.json');

        if (!fs.existsSync(contractPath)) {
            console.warn(`⚠️  Contract ABI not found at ${contractPath}. Please deploy contracts first.`);
            return { web3: null, contract: null };
        }

        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contractJson.networks[networkId] || contractJson.networks['5777']; // fallback to default ganache Id

        if (!deployedNetwork) {
            console.warn(`⚠️  Contract not deployed to the current network ${networkId}`);
            console.log(`Available networks:`, Object.keys(contractJson.networks));
            return { web3, contract: null };
        }

        contract = new web3.eth.Contract(
            contractJson.abi,
            deployedNetwork.address
        );

        console.log('✅ Web3 initialized and contract loaded at:', deployedNetwork.address);
        return { web3, contract };
    } catch (error) {
        console.error('❌ Failed to initialize Web3:', error.message);
        return { web3: null, contract: null };
    }
};

const getWeb3 = () => web3;
const getContract = () => contract;

module.exports = { initWeb3, getWeb3, getContract };
