# Blockchain-Based Digital Forensic Evidence Management System

An enterprise-grade, tamper-proof digital evidence management system utilizing Blockchain, IPFS, MERN stack, and Docker.

## Architecture Diagram Description
- **Frontend**: React.js SPA (Vite, Context API) handles user interactions.
- **Backend**: Node.js/Express.js REST API manages authentication (JWT, Roles), database operations, and interacts with IPFS and Blockchain.
- **Database**: MongoDB stores evidence metadata and user information.
- **Storage**: IPFS (Kubo) stores the actual evidentiary files immutably.
- **Blockchain**: Local Ganache node running an Ethereum-compatible network. Smart Contract (EvidenceChain.sol) stores the SHA-256 hash of the IPFS file along with case ID, role, and timestamp for immutable verification.
- **Infrastructure**: All components are fully containerized using Docker and orchestrated with Docker Compose for seamless deployment.

## Features
- Upload digital evidence to decentralized storage (IPFS).
- Cryptographically secure evidence hashing (SHA-256).
- Immutable ledger recording of the file hash on the blockchain.
- Verifiable evidence integrity (tamper detection).
- Role-based Access Control (Investigator, Officer, Admin).
- Full audit trail of evidence upload.

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
   - Frontend App (Port 3000)

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
