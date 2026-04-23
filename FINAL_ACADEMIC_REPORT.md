# Comprehensive Academic Project Report
**Title:** Decentralized Digital Forensic Evidence Management System Framework
**Domain:** Blockchain Security, Web App Development, Digital Forensics
**Author:** T. Venkata Dhruvil

---

## 1. Abstract
The integrity of digital forensic evidence is paramount in legal proceedings. Traditional centralized databases are highly susceptible to malicious hacking, insider threats, and accidental data corruption, which can compromise the Chain of Custody. This project proposes a decentralized, immutable evidence management ecosystem utilizing Ethereum Smart Contracts (Ganache), the InterPlanetary File System (IPFS), and a React-Node.js web application. By computing cryptographic SHA-256 hashes of physical evidence and anchoring them onto an EVM-compatible ledger, the system mathematically guarantees zero-trust verification of evidence, preventing unauthorized tampering.

## 2. Introduction & Problem Statement
With the digital transformation of police departments globally, massive amounts of data (photos, videos, audio confessions) are stored on local SQL servers. 

**Problem Statement:** If a malicious system administrator or a remote hacker gains access to the law enforcement server, they can silently swap a file or manipulate custody logs. When the court reviews the evidence, they have no mathematical proof that the digital file is the exact same binary file uploaded by the First Responding Officer on the day of the crime.

**Solution:** By utilizing Blockchain technology—specifically smart contracts designed to be computationally irreversible without immense financial cost—we create an environment where data provenance is public, transparent, and permanent.

## 3. Literature Review
Existing Chain of Custody software like *EnCase* or *AccessData FTK* provide excellent extraction tools, but they rely on centralized Vaults. Recent proposals in academia have suggested using Hyperledger Fabric for police data. However, private blockchains require immense infrastructure. This project innovates by combining a flexible MERN (MongoDB, Express, React, Node) stack for high-speed UI interaction, paired with the Ethereum Testnet (Ganache/Sepolia) simply acting as a mathematical anchor, ensuring high-throughput without bloating the blockchain.

## 4. Feasibility Study
*   **Technical Feasibility:** Highly feasible. The system utilizes Docker containerization to rapidly spin up ClamAV (Anti-virus), IPFS nodes, and Ganache local testnets, eliminating complex localized installations.
*   **Operational Feasibility:** The use of Single Sign-On (Google OAuth 2.0) and a clean "Dark Mode" UI ensures that non-technical police officers can upload and verify evidence seamlessly.
*   **Economic Feasibility:** IPFS provides free distributed storage, and by anchoring only the Hash (instead of the 500MB raw video) to the blockchain network, gas fees are kept extremely minimal.

---

## 5. Software Requirements Specification (SRS) Data
*Use this section to populate your University SRS Document.*

### 5.1 User Roles
1.  **Investigating Officer:** Can upload raw file buffers, initiate physical transfer of custody, and view their assigned cases.
2.  **System Administrator:** Can monitor audit logs, manage unauthorized access attempts, and oversee MongoDB health.
3.  **Third-Party Auditor:** Can utilize the "Verify Engine" to cross-reference a file's integrity against the blockchain.

### 5.2 Functional Requirements (FR)
*   **FR-1:** The backend must intercept `multipart/form-data` uploads and extract the raw buffer into memory.
*   **FR-2:** The memory buffer must be streamed to `clamdscan` via TCP port 3310. If an infection is found, the system must abort and flag the user.
*   **FR-3:** The system must generate a 256-bit SHA-256 cryptographic signature of the clean file.
*   **FR-4:** The signature must be published to the IPFS network to attain a Content Identifier (CID).
*   **FR-5:** The `EvidenceChain.sol` smart contract must receive the CID and Hash, permanently mutating the blockchain state.
*   **FR-6:** Multi-signature custody transfers must require a cryptographic `approveTransfer` call from the receiving officer.

### 5.3 Non-Functional Requirements (NFR)
*   **NFR-1 (Security):** Zero files are stored on the Node.js server. Files exist only in temporary memory before being offloaded to IPFS to prevent server exploitation.
*   **NFR-2 (Performance):** The blockchain verification comparison between the NoSQL replica and the EVM state must complete in under 5 seconds.
*   **NFR-3 (Availability):** React frontend proxying via Vite ensures robust connection state handling.

---

## 6. System Design Document (SDD) Data
*Use this section to populate your University SDD Document.*

### 6.1 Architecture Diagram Flow
1.  **Client Tier:** React Web App (Vite). Implements Framer Motion for asynchronous state feedback.
2.  **Logic Tier:** Node.js Express Server. Acts as the transaction signer using `web3.js` and `@truffle/hdwallet-provider`.
3.  **Data Tier (Off-Chain):** MongoDB locally caching the Evidence arrays to prevent overwhelming network RPC calls.
4.  **Storage Tier (Off-Chain):** IPFS daemon distributing the physical multimedia files.
5.  **Ledger Tier (On-Chain):** `Ganache-cli` local blockchain validating the EVM opcodes of the Smart Contract.

### 6.2 MongoDB Data Schema (Off-Chain)
*   `Evidence Schema:`
    *   `evidenceId`: Integer (Primary Key)
    *   `caseId`: String
    *   `uploader`: String (Email Hash)
    *   `sha256Hash`: String (Crypto Signature)
    *   `ipfsHash`: String (IPFS CID)
    *   `txHash`: String (Ganache Receipt)
    *   `custodyHistory`: Array [ { handlerId, timestamp, action } ]

### 6.3 Solidity Smart Contract (On-Chain)
*   `Contract Name:` EvidenceChain
*   `Mappings:` Maps a `uint256 evidenceId` to an `EvidenceRecord` struct.
*   `Modifiers:` `onlyOwner` applied to prevent unauthorized eth addresses from executing the `storeEvidence` sequence.

---

## 7. Implementation & DevOps Methodologies
The application was engineered utilizing modern CI/CD DevOps methodology. 
*   **Vulnerability Scanning:** The Jenkins pipeline is configured to run `npm audit --audit-level=high` before compiling.
*   **Containerization:** The entire MERN + Ganache network runs within virtualized Docker networks, allowing internal TCP routing without exposing databases to the public OS. 
*   **Global Tunneling:** Ngrok SSL tunneling routes dynamic requests from local Vite environments to public internet subdomains, handling strict CORS dynamically.

## 8. Conclusion
The Forensic Chain System successfully bridges the gap between digital forensics and decentralized trust infrastructure. By abstracting the complex cryptographic realities of Solidity and IPFS behind a gorgeous, highly-animated React interface, law enforcement can utilize cutting-edge tamper-proof technology without requiring specialized training. 

## 9. Future Enhancements
*   **Automated AI Pre-Scanning:** Integrating Computer Vision libraries to identify weapons or illicit material inside videos before the hash is computed.
*   **Filecoin Integration:** Upgrading the local IPFS node to the public Filecoin network to guarantee permanent decentralized storage backed by economic incentives.
