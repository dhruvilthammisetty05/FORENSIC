require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },
        docker: {
            host: "ganache",
            port: 8545,
            network_id: "*",
        },
        sepolia: {
            provider: () => new HDWalletProvider(
                process.env.SEPOLIA_PRIVATE_KEY, 
                `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
            ),
            network_id: 11155111,       // Sepolia's id
            gas: 4465030,
            confirmations: 2,           // Wait for 2 confirmations to ensure security
            timeoutBlocks: 200,         // Increase timeout for testnet dynamics
            skipDryRun: true            // Skip dry run before migrations
        }
    },

    compilers: {
        solc: {
            version: "0.8.19",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};
