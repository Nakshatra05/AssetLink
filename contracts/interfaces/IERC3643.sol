// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IERC3643
 * @dev Interface for ERC-3643 T-REX token standard
 */
interface IERC3643 {
    /**
     * @dev Returns the restriction code for a transfer
     * @param from The address of the sender
     * @param to The address of the recipient
     * @param amount The amount of tokens to transfer
     * @return restrictionCode The restriction code (0 = no restriction)
     */
    function detectTransferRestriction(address from, address to, uint256 amount) 
        external view returns (uint8 restrictionCode);
    
    /**
     * @dev Returns a human-readable message for a restriction code
     * @param restrictionCode The restriction code
     * @return message The human-readable message
     */
    function messageForTransferRestriction(uint8 restrictionCode) 
        external pure returns (string memory message);
}
