# Secure Forensic Chain System

An Enterprise-grade Digital Evidence Management Platform leveraging MERN, Ethereum Smart Contracts (Ganache), IPFS, and Dockerization.

## Features
- **Immutable Ledger:** All evidence file hashes (SHA-256) are anchored to local Ganache/Sepolia blockchain.
- **Automated ClamAV:** Hardware-level virus scanning prevents malicious file uploads.
- **Multi-Signature Custody:** Transfer of physical evidence ownership requires cryptographic sign-off.
- **Court-ready Validation:** Outputs dynamically stamped physical PDF reports.

<<<<<<< HEAD
## Quick Start (Dockerized)
Ensure Docker Desktop is running.
```bash
docker compose up -d --build
```
The Frontend Dashboard will be exposed on `localhost:3001`!
=======
## Prerequisites
- Docker & Docker Compose
- Node.js (for local dev without Docker, though Docker is recommended)
- Git

## Setup & Run Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo_url>
   cd forensic-chain-system
   ```

2. **Environment Variables:**
   A `.env` file should be present in both frontend and backend.
   Examples are provided in the respective directories.
   For docker, global envs are handled in `docker-compose.yml` but you can set up a `.env` in the root explicitly.

3. **Start the network:**
   ```bash
   docker-compose up -d --build
   ```

   This spins up:
   - Ganache (Port 8545)
   - IPFS Node (Ports 5001, 8080)
   - MongoDB (Port 27017)
   - Backend API (Port 5000)
   - Frontend App (Port 3001)

4. **Deploy Smart Contract (Initial Setup):**
   The backend container requires the contract ABI. First, let Ganache start.
   Then, in a separate terminal:
   ```bash
   cd blockchain
   npm install -g truffle
   npm install
   truffle migrate --network development
   ```
   **Note**: The repository has a volume mapping `blockchain/build/contracts` -> `/app/contracts` in the backend so it automatically sees the compiled JSON!

5. **Access Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commit Strategy
- `feat:` for new features (e.g., `feat: implement IPFS upload`)
- `fix:` for bug fixes
- `docs:` for documentation updates
- `chore:` for maintenance tasks
- `refactor:` for code restructuring

## Branch Structure
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Specific feature branches
- `hotfix/*`: Urgent fixes in production

## Environment Variables Guide
### Backend (`backend/.env`)
PORT=5000
MONGO_URI=mongodb://mongo:27017/forensic_db
JWT_SECRET=super_secret
BLOCKCHAIN_URL=http://ganache:8545
IPFS_URL=http://ipfs:5001
CONTRACT_ADDRESS_PATH=/app/contracts/EvidenceChain.json

### Frontend (`frontend/.env`)
VITE_API_URL=http://localhost:5000/api
>>>>>>> 47aa56b74f7ab063a82a5956fb313def5ecc31d5
