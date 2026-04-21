#!/usr/bin/env node

/**
 * Deployment script for EvidenceChain smart contract
 * This script compiles and deploys the contract to the configured network
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function deploy() {
    try {
        console.log('🚀 Starting smart contract deployment...');
        
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        // Step 1: Compile contracts
        console.log('📦 Compiling contracts...');
        try {
            const { stdout, stderr } = await execPromise('npx truffle compile', {
                cwd: __dirname.replace('\\scripts', '').replace('/scripts', '')
            });
            console.log(stdout);
            if (stderr && !stderr.includes('warning')) {
                console.error('Compilation warnings/errors:', stderr);
            }
        } catch (error) {
            console.error('❌ Compilation failed:', error.message);
            throw error;
        }

        // Step 2: Migrate/Deploy contracts
        console.log('🔗 Deploying contracts to blockchain...');
        const network = process.env.TRUFFLE_NETWORK || 'docker';
        try {
            const { stdout, stderr } = await execPromise(`npx truffle migrate --network ${network} --reset`, {
                cwd: __dirname.replace('\\scripts', '').replace('/scripts', '')
            });
            console.log(stdout);
            if (stderr && !stderr.includes('warning')) {
                console.error('Migration warnings/errors:', stderr);
            }
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }

        console.log('✅ Smart contract deployment completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

deploy();
