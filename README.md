# Secure Forensic Chain System

An Enterprise-grade Digital Evidence Management Platform leveraging MERN, Ethereum Smart Contracts (Ganache), IPFS, and Dockerization.

## Features
- **Immutable Ledger:** All evidence file hashes (SHA-256) are anchored to local Ganache/Sepolia blockchain.
- **Automated ClamAV:** Hardware-level virus scanning prevents malicious file uploads.
- **Multi-Signature Custody:** Transfer of physical evidence ownership requires cryptographic sign-off.
- **Court-ready Validation:** Outputs dynamically stamped physical PDF reports.

## Quick Start (Dockerized)
Ensure Docker Desktop is running.
```bash
docker compose up -d --build
```
The Frontend Dashboard will be exposed on `localhost:3001`!
