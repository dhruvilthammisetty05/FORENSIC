const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

let web3;
let contract;

const initWeb3 = async () => {
    try {
        web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545');

        const contractPath = path.resolve(process.cwd(), process.env.CONTRACT_ADDRESS_PATH || '../blockchain/build/contracts/EvidenceChain.json');

        if (!fs.existsSync(contractPath)) {
            console.warn(`Contract ABI not found at ${contractPath}. Blockchain features will be disabled until deployed.`);
            return { web3: null, contract: null };
        }

        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contractJson.networks[networkId] || contractJson.networks['5777']; // fallback to default ganache Id

        if (!deployedNetwork) {
            console.warn(`Contract not deployed to the current network ${networkId}`);
            return { web3, contract: null };
        }

        contract = new web3.eth.Contract(
            contractJson.abi,
            deployedNetwork.address
        );

        console.log('Web3 initialized and contract loaded at:', deployedNetwork.address);
        return { web3, contract };
    } catch (error) {
        console.error('Failed to initialize Web3:', error.message);
        return { web3: null, contract: null };
    }
};

const getWeb3 = () => web3;
const getContract = () => contract;

module.exports = { initWeb3, getWeb3, getContract };
