// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IERC3643.sol";
import "./WhitelistRegistry.sol";

/**
 * @title RWAToken
 * @dev ERC-3643 compliant Real World Asset token with transfer restrictions
 */
contract RWAToken is ERC20, Ownable, Pausable, IERC3643 {
    WhitelistRegistry public whitelistRegistry;
    
    // Asset passport - IPFS hash containing compliance documents
    string public assetPassportHash;
    
    // Token metadata
    string public assetType;
    uint256 public totalAssetValue;
    uint256 public tokenizationDate;
    
    // Transfer restrictions
    mapping(address => bool) public frozenAccounts;
    
    event AssetPassportUpdated(string newHash);
    event AccountFrozen(address indexed account);
    event AccountUnfrozen(address indexed account);
    event TransferBlocked(address indexed from, address indexed to, uint256 amount, string reason);
    
    modifier onlyWhitelisted(address account) {
        require(whitelistRegistry.isWhitelisted(account), "Account not whitelisted");
        _;
    }
    
    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account is frozen");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _whitelistRegistry,
        string memory _assetType,
        uint256 _totalAssetValue,
        string memory _assetPassportHash
    ) ERC20(name, symbol) {
        whitelistRegistry = WhitelistRegistry(_whitelistRegistry);
        assetType = _assetType;
        totalAssetValue = _totalAssetValue;
        assetPassportHash = _assetPassportHash;
        tokenizationDate = block.timestamp;
        
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Override transfer to include compliance checks
     */
    function transfer(address to, uint256 amount) 
        public 
        override 
        onlyWhitelisted(msg.sender) 
        onlyWhitelisted(to) 
        notFrozen(msg.sender) 
        notFrozen(to) 
        whenNotPaused 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to include compliance checks
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        onlyWhitelisted(from) 
        onlyWhitelisted(to) 
        notFrozen(from) 
        notFrozen(to) 
        whenNotPaused 
        returns (bool) 
    {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Check if transfer is allowed (ERC-1404 compliance)
     */
    function detectTransferRestriction(address from, address to, uint256 amount) 
        external 
        view 
        returns (uint8) 
    {
        if (paused()) return 1; // Contract paused
        if (!whitelistRegistry.isWhitelisted(from)) return 2; // Sender not whitelisted
        if (!whitelistRegistry.isWhitelisted(to)) return 3; // Recipient not whitelisted
        if (frozenAccounts[from]) return 4; // Sender frozen
        if (frozenAccounts[to]) return 5; // Recipient frozen
        if (balanceOf(from) < amount) return 6; // Insufficient balance
        
        return 0; // No restrictions
    }
    
    /**
     * @dev Get human readable message for restriction code
     */
    function messageForTransferRestriction(uint8 restrictionCode) 
        external 
        pure 
        returns (string memory) 
    {
        if (restrictionCode == 1) return "Contract is paused";
        if (restrictionCode == 2) return "Sender not whitelisted";
        if (restrictionCode == 3) return "Recipient not whitelisted";
        if (restrictionCode == 4) return "Sender account frozen";
        if (restrictionCode == 5) return "Recipient account frozen";
        if (restrictionCode == 6) return "Insufficient balance";
        
        return "No restrictions";
    }
    
    /**
     * @dev Update asset passport hash (only owner)
     */
    function updateAssetPassport(string memory newHash) external onlyOwner {
        assetPassportHash = newHash;
        emit AssetPassportUpdated(newHash);
    }
    
    /**
     * @dev Freeze account (only owner)
     */
    function freezeAccount(address account) external onlyOwner {
        frozenAccounts[account] = true;
        emit AccountFrozen(account);
    }
    
    /**
     * @dev Unfreeze account (only owner)
     */
    function unfreezeAccount(address account) external onlyOwner {
        frozenAccounts[account] = false;
        emit AccountUnfrozen(account);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner onlyWhitelisted(to) {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens (only owner)
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
