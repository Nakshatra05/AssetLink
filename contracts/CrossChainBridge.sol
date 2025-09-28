// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RWAToken.sol";

/**
 * @title CrossChainBridge
 * @dev Handles cross-chain transfers for RWA tokens on Kadena Chainweb
 */
contract CrossChainBridge is Ownable, ReentrancyGuard {
    
    struct BridgeRequest {
        address token;
        address from;
        address to;
        uint256 amount;
        uint256 sourceChain;
        uint256 targetChain;
        uint256 timestamp;
        bool completed;
        bytes32 txHash;
    }
    
    mapping(bytes32 => BridgeRequest) public bridgeRequests;
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => bool) public supportedChains;
    mapping(address => bool) public bridgeOperators;
    
    uint256 public bridgeFee = 0.001 ether;
    uint256 public currentChainId;
    
    event BridgeInitiated(
        bytes32 indexed requestId,
        address indexed token,
        address indexed from,
        address to,
        uint256 amount,
        uint256 sourceChain,
        uint256 targetChain
    );
    
    event BridgeCompleted(
        bytes32 indexed requestId,
        bytes32 indexed txHash
    );
    
    event TokenSupported(address indexed token);
    event ChainSupported(uint256 indexed chainId);
    
    modifier onlyBridgeOperator() {
        require(bridgeOperators[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }
    
    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId], "Chain not supported");
        _;
    }
    
    constructor(uint256 _currentChainId) {
        currentChainId = _currentChainId;
        bridgeOperators[msg.sender] = true;
        supportedChains[_currentChainId] = true;
    }
    
    /**
     * @dev Initiate cross-chain transfer
     */
    function initiateBridge(
        address token,
        address to,
        uint256 amount,
        uint256 targetChain
    ) external payable nonReentrant onlySupportedToken(token) onlySupportedChain(targetChain) {
        require(msg.value >= bridgeFee, "Insufficient bridge fee");
        require(targetChain != currentChainId, "Cannot bridge to same chain");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        RWAToken rwaToken = RWAToken(token);
        
        // Check if transfer would be allowed
        uint8 restriction = rwaToken.detectTransferRestriction(msg.sender, address(this), amount);
        require(restriction == 0, rwaToken.messageForTransferRestriction(restriction));
        
        // Lock tokens in bridge contract
        require(rwaToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Generate unique request ID
        bytes32 requestId = keccak256(abi.encodePacked(
            token,
            msg.sender,
            to,
            amount,
            currentChainId,
            targetChain,
            block.timestamp,
            block.number
        ));
        
        // Store bridge request
        bridgeRequests[requestId] = BridgeRequest({
            token: token,
            from: msg.sender,
            to: to,
            amount: amount,
            sourceChain: currentChainId,
            targetChain: targetChain,
            timestamp: block.timestamp,
            completed: false,
            txHash: bytes32(0)
        });
        
        emit BridgeInitiated(requestId, token, msg.sender, to, amount, currentChainId, targetChain);
    }
    
    /**
     * @dev Complete bridge transfer (called by bridge operator)
     */
    function completeBridge(bytes32 requestId, bytes32 txHash) 
        external 
        onlyBridgeOperator 
        nonReentrant 
    {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(!request.completed, "Bridge already completed");
        require(request.timestamp > 0, "Invalid request");
        
        request.completed = true;
        request.txHash = txHash;
        
        emit BridgeCompleted(requestId, txHash);
    }
    
    /**
     * @dev Release tokens (for failed bridges or returns)
     */
    function releaseTokens(bytes32 requestId) 
        external 
        onlyBridgeOperator 
        nonReentrant 
    {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(!request.completed, "Bridge already completed");
        require(request.timestamp > 0, "Invalid request");
        
        RWAToken rwaToken = RWAToken(request.token);
        require(rwaToken.transfer(request.from, request.amount), "Token release failed");
        
        request.completed = true;
    }
    
    /**
     * @dev Add supported token
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
        emit TokenSupported(token);
    }
    
    /**
     * @dev Add supported chain
     */
    function addSupportedChain(uint256 chainId) external onlyOwner {
        supportedChains[chainId] = true;
        emit ChainSupported(chainId);
    }
    
    /**
     * @dev Add bridge operator
     */
    function addBridgeOperator(address operator) external onlyOwner {
        bridgeOperators[operator] = true;
    }
    
    /**
     * @dev Set bridge fee
     */
    function setBridgeFee(uint256 newFee) external onlyOwner {
        bridgeFee = newFee;
    }
    
    /**
     * @dev Withdraw bridge fees
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Get bridge request details
     */
    function getBridgeRequest(bytes32 requestId) external view returns (BridgeRequest memory) {
        return bridgeRequests[requestId];
    }
}
