// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WhitelistRegistry
 * @dev Manages KYC/AML whitelist for RWA token holders
 */
contract WhitelistRegistry is Ownable {
    
    struct KYCData {
        bool isWhitelisted;
        uint256 kycLevel; // 1 = basic, 2 = enhanced, 3 = institutional
        uint256 approvalDate;
        string jurisdiction;
        address approvedBy;
    }
    
    mapping(address => KYCData) public kycData;
    mapping(address => bool) public kycApprovers;
    
    event AddressWhitelisted(address indexed account, uint256 kycLevel, string jurisdiction);
    event AddressRemovedFromWhitelist(address indexed account);
    event KYCApproverAdded(address indexed approver);
    event KYCApproverRemoved(address indexed approver);
    
    modifier onlyKYCApprover() {
        require(kycApprovers[msg.sender] || msg.sender == owner(), "Not authorized to approve KYC");
        _;
    }
    
    constructor() {
        kycApprovers[msg.sender] = true;
    }
    
    /**
     * @dev Add address to whitelist after KYC approval
     */
    function addToWhitelist(
        address account, 
        uint256 kycLevel, 
        string memory jurisdiction
    ) external onlyKYCApprover {
        require(account != address(0), "Invalid address");
        require(kycLevel >= 1 && kycLevel <= 3, "Invalid KYC level");
        
        kycData[account] = KYCData({
            isWhitelisted: true,
            kycLevel: kycLevel,
            approvalDate: block.timestamp,
            jurisdiction: jurisdiction,
            approvedBy: msg.sender
        });
        
        emit AddressWhitelisted(account, kycLevel, jurisdiction);
    }
    
    /**
     * @dev Remove address from whitelist
     */
    function removeFromWhitelist(address account) external onlyKYCApprover {
        kycData[account].isWhitelisted = false;
        emit AddressRemovedFromWhitelist(account);
    }
    
    /**
     * @dev Check if address is whitelisted
     */
    function isWhitelisted(address account) external view returns (bool) {
        return kycData[account].isWhitelisted;
    }
    
    /**
     * @dev Get KYC data for address
     */
    function getKYCData(address account) external view returns (KYCData memory) {
        return kycData[account];
    }
    
    /**
     * @dev Add KYC approver
     */
    function addKYCApprover(address approver) external onlyOwner {
        kycApprovers[approver] = true;
        emit KYCApproverAdded(approver);
    }
    
    /**
     * @dev Remove KYC approver
     */
    function removeKYCApprover(address approver) external onlyOwner {
        kycApprovers[approver] = false;
        emit KYCApproverRemoved(approver);
    }
    
    /**
     * @dev Batch whitelist addresses
     */
    function batchWhitelist(
        address[] memory accounts, 
        uint256[] memory kycLevels, 
        string[] memory jurisdictions
    ) external onlyKYCApprover {
        require(
            accounts.length == kycLevels.length && 
            accounts.length == jurisdictions.length, 
            "Array lengths mismatch"
        );
        
        for (uint256 i = 0; i < accounts.length; i++) {
            kycData[accounts[i]] = KYCData({
                isWhitelisted: true,
                kycLevel: kycLevels[i],
                approvalDate: block.timestamp,
                jurisdiction: jurisdictions[i],
                approvedBy: msg.sender
            });
            
            emit AddressWhitelisted(accounts[i], kycLevels[i], jurisdictions[i]);
        }
    }
}
