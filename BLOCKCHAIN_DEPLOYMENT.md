# 🔧 Smart Contract Deployment Guide

## Issue
The error "Blockchain network unavailable. Contract not loaded." occurs because:
1. The smart contracts haven't been compiled yet
2. The contracts haven't been deployed to the Ganache blockchain
3. Web3 initialization wasn't properly awaited before the server starts

## ✅ What Was Fixed

### 1. **Server.js - Proper Async Initialization**
- Changed `initWeb3()` from synchronous to async/await
- Server now waits for Web3 and contract to be loaded before listening for requests

### 2. **Web3 Config - Retry Logic & Better Error Handling**
- Added retry mechanism (30 attempts with 2-second intervals) to wait for blockchain
- Better error messages and logging
- Waits for Ganache to be fully ready before attempting contract loading

### 3. **Docker Setup - Automated Contract Deployment**
- Added `blockchain-deployer` service that compiles and deploys contracts
- Contracts are built into the shared volume so backend can access them
- All services properly depend on deployment completing

### 4. **Blockchain Dockerfile**
- New Dockerfile for blockchain service to compile and deploy contracts

## 🚀 How to Deploy Now

### Option 1: Full Docker Compose (Recommended for first run)
```bash
# Build and start all services INCLUDING contract deployment
docker-compose --profile deploy up --build

# This will:
# 1. Start Ganache
# 2. Compile smart contracts
# 3. Deploy contracts to Ganache
# 4. Start backend
# 5. Start frontend
# 6. Start all other services
```

Wait for output showing: `✅ Web3 initialized and contract loaded at: 0x...`

### Option 2: Subsequent Runs (without redeploying contracts)
```bash
# Start services without the deployer
docker-compose up

# Or if you need to redeploy:
docker-compose --profile deploy up
```

## 🔍 Verification Steps

1. **Check Backend Logs:**
   ```
   docker-compose logs backend | grep -E "(✅|Web3|contract loaded)"
   ```

2. **Test Upload:**
   - Log in to the application
   - Navigate to "Submit New Evidence"
   - Select a test file and case ID
   - Click "LOCK EVIDENCE IN LEDGER"
   - Should now work without the blockchain error!

3. **Check Contract was Deployed:**
   ```bash
   # Verify contract file exists
   ls -la blockchain/build/contracts/EvidenceChain.json
   
   # Should show file size > 1KB with ABI data
   ```

## 📋 Environment Variables

The following are already configured in `docker-compose.yml`:
- `BLOCKCHAIN_URL=http://ganache:8545` - Ganache connection
- `IPFS_URL=http://ipfs:5001` - IPFS node connection
- `MONGO_URI=mongodb://mongo:27017/forensic_db` - MongoDB connection
- `TRUFFLE_NETWORK=docker` - Tells Truffle which network config to use

## 🛠 Manual Deployment (if Docker fails)

If you need to manually deploy:

```bash
# In blockchain directory
cd blockchain

# Install dependencies
npm install

# Compile contracts
npx truffle compile

# Deploy to local Ganache (if running on localhost:8545)
npx truffle migrate --network docker --reset

# Or for local development network
npx truffle migrate --network development --reset
```

## 📝 Troubleshooting

### Error: "Contract ABI not found"
- Make sure `docker-compose --profile deploy up` completes successfully
- Check `blockchain/build/contracts/` folder is not empty

### Error: "Contract not deployed to the current network"
- Restart Docker: `docker-compose down && docker-compose --profile deploy up --build`
- Check Ganache network ID matches (should be 5777)

### Error: "Failed to connect to blockchain"
- Wait longer for containers to start (up to 60 seconds)
- Check Ganache container is running: `docker-compose ps`

### Still "Contract not loaded"?
- Check backend logs: `docker-compose logs backend`
- Ensure deployment completed: `docker-compose logs blockchain-deployer`
- Try full reset: `docker-compose down -v && docker-compose --profile deploy up --build`

## 🎯 Next Steps

After successful deployment:
1. Create a test case in the system
2. Upload evidence with the case ID
3. Verify transaction appears on blockchain
4. Check IPFS hash is stored correctly

---
**Note:** The contract deployment happens automatically on first run. Subsequent runs do NOT redeploy unless you use `--profile deploy`.
