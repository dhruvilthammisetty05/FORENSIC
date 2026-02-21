// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceChain {
    struct Evidence {
        string fileHash;
        string caseId;
        string role;
        uint timestamp;
        bool exists;
    }

    mapping(uint => Evidence) private evidences;
    
    event EvidenceStored(uint indexed evidenceId, string caseId, string role, uint timestamp);

    function storeEvidence(uint _evidenceId, string memory _fileHash, string memory _caseId, string memory _role) public {
        require(!evidences[_evidenceId].exists, "Evidence ID already exists");
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        require(bytes(_caseId).length > 0, "Case ID cannot be empty");
        require(bytes(_role).length > 0, "Role cannot be empty");

        evidences[_evidenceId] = Evidence({
            fileHash: _fileHash,
            caseId: _caseId,
            role: _role,
            timestamp: block.timestamp,
            exists: true
        });

        emit EvidenceStored(_evidenceId, _caseId, _role, block.timestamp);
    }

    function getEvidence(uint _evidenceId) public view returns (string memory fileHash, string memory caseId, string memory role, uint timestamp) {
        require(evidences[_evidenceId].exists, "Evidence does not exist");
        Evidence memory e = evidences[_evidenceId];
        return (e.fileHash, e.caseId, e.role, e.timestamp);
    }
}
