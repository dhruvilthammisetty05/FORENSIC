# 🚨 Quick Troubleshooting Guide

## Error: "Blockchain network unavailable. Contract not loaded."

### ✅ Quick Fix (Try These in Order)

#### 1. Full Restart with Fresh Deployment
```powershell
# Stop everything
docker-compose down -v

# Start with contract deployment
docker-compose --profile deploy up --build

# Wait for this message to appear in logs:
# "✅ Web3 initialized and contract loaded at: 0x..."
```

#### 2. Check Contract File Exists
```powershell
# On Windows PowerShell
Test-Path blockchain\build\contracts\EvidenceChain.json

# Should return True
# If False, contracts weren't compiled/deployed
```

#### 3. View Backend Logs
```powershell
# See what backend is saying
docker-compose logs backend -f

# Look for:
# ✅ messages = good
# ❌ or ⚠️ messages = problems to fix
```

#### 4. Check All Services Are Running
```powershell
# List running containers
docker-compose ps

# Should show all services with "Up" status:
# ganache, ipfs, mongo, clamav, backend, frontend
```

#### 5. Verify Ganache is Ready
```powershell
# Check Ganache logs
docker-compose logs ganache | tail -20

# Wait for "Listening on 0.0.0.0:8545"
```

---

## Common Issues & Solutions

### Issue: "failed to fetch from registry"
**Solution:** 
```powershell
# Clear Docker images and try again
docker image prune -a
docker-compose --profile deploy up --build
```

### Issue: Port 5000, 3001, or 8545 already in use
**Solution:**
```powershell
# Find and stop the process using the port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different ports in docker-compose.yml
# Edit the port mappings like "5001:5000"
```

### Issue: MongoDB connection refused
**Solution:**
```powershell
# Restart mongo service
docker-compose restart mongo

# Check mongo is listening
docker-compose logs mongo | tail -10
```

### Issue: IPFS connection errors
**Solution:**
```powershell
# Restart IPFS
docker-compose restart ipfs

# Wait a few seconds for it to initialize
# Check status
docker-compose logs ipfs | tail -10
```

### Issue: "contract not deployed to the current network"
**Solution:**
```powershell
# Make sure you're deploying to docker network
# In blockchain/truffle-config.js, network should be "docker"

# Redeploy with correct network
docker-compose --profile deploy up --force-recreate --build
```

---

## Development Tips

### View Real-Time Logs
```powershell
# Backend logs only
docker-compose logs -f backend

# All services
docker-compose logs -f

# Specific service
docker-compose logs -f <service_name>
```

### Access Container Shell
```powershell
# Get backend shell (for debugging)
docker-compose exec backend sh

# In the shell, you can:
# ls -la              # List files
# cat config/web3.js  # View files
# npm install         # Install packages
# exit                # Exit shell
```

### Check Contract Details
```powershell
# View deployed contract address
docker-compose exec backend cat /app/contracts/EvidenceChain.json | grep "address"

# View contract ABI
docker-compose exec backend cat /app/contracts/EvidenceChain.json | grep "abi" -A 50
```

### Reset Everything
```powershell
# WARNING: This removes ALL data (databases, volumes, etc.)
docker-compose down -v

# Start fresh
docker-compose --profile deploy up --build
```

---

## When to Ask for Help

If after following these steps you still see "Contract not loaded", provide:

1. **Full backend logs:**
   ```powershell
   docker-compose logs backend > backend-logs.txt
   ```

2. **Docker ps output:**
   ```powershell
   docker-compose ps > docker-status.txt
   ```

3. **Contract file check:**
   ```powershell
   ls -la blockchain/build/contracts/
   file blockchain/build/contracts/EvidenceChain.json
   ```

4. **Blockchain deployer logs:**
   ```powershell
   docker-compose logs blockchain-deployer > deployer-logs.txt
   ```

Share these files with your friend/team for faster debugging! 🚀
