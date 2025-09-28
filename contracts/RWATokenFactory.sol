// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RWAToken.sol";
import "./WhitelistRegistry.sol";

/**
 * @title RWATokenFactory
 * @dev Factory contract for deploying RWA tokens
 */
contract RWATokenFactory is Ownable {
    
    WhitelistRegistry public immutable whitelistRegistry;
    
    struct TokenInfo {
        address tokenAddress;
        address issuer;
        string assetType;
        uint256 totalAssetValue;
        uint256 deploymentDate;
        bool isActive;
    }
    
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => address[]) public issuerTokens;
    address[] public allTokens;
    
    uint256 public deploymentFee = 0.01 ether;
    
    event TokenDeployed(
        address indexed tokenAddress,
        address indexed issuer,
        string name,
        string symbol,
        string assetType,
        uint256 totalAssetValue
    );
    
    constructor(address _whitelistRegistry) {
        whitelistRegistry = WhitelistRegistry(_whitelistRegistry);
    }
    
    /**
     * @dev Deploy new RWA token
     */
    function deployRWAToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory assetType,
        uint256 totalAssetValue,
        string memory assetPassportHash
    ) external payable returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(initialSupply > 0, "Initial supply must be greater than 0");
        
        // Deploy new RWA token
        RWAToken newToken = new RWAToken(
            name,
            symbol,
            initialSupply,
            address(whitelistRegistry),
            assetType,
            totalAssetValue,
            assetPassportHash
        );
        
        // Transfer ownership to issuer
        newToken.transferOwnership(msg.sender);
        
        // Store token info
        tokenInfo[address(newToken)] = TokenInfo({
            tokenAddress: address(newToken),
            issuer: msg.sender,
            assetType: assetType,
            totalAssetValue: totalAssetValue,
            deploymentDate: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        issuerTokens[msg.sender].push(address(newToken));
        allTokens.push(address(newToken));
        
        emit TokenDeployed(
            address(newToken),
            msg.sender,
            name,
            symbol,
            assetType,
            totalAssetValue
        );
        
        return address(newToken);
    }
    
    /**
     * @dev Get tokens deployed by issuer
     */
    function getIssuerTokens(address issuer) external view returns (address[] memory) {
        return issuerTokens[issuer];
    }
    
    /**
     * @dev Get all deployed tokens
     */
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    /**
     * @dev Get token count
     */
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
    
    /**
     * @dev Set deployment fee
     */
    function setDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
    }
    
    /**
     * @dev Withdraw deployment fees
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Deactivate token (emergency)
     */
    function deactivateToken(address tokenAddress) external onlyOwner {
        tokenInfo[tokenAddress].isActive = false;
    }
}
