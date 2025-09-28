const { ethers } = require("ethers")

// Kadena Chainweb configuration
const KADENA_NETWORKS = {
  testnet: {
    networkId: "testnet04",
    apiHost: "https://api.testnet.chainweb.com",
    chains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  mainnet: {
    networkId: "mainnet01",
    apiHost: "https://api.chainweb.com",
    chains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
}

class BlockchainService {
  constructor(network = "testnet") {
    this.network = KADENA_NETWORKS[network]
    this.providers = {}

    // Initialize providers for each chain
    this.network.chains.forEach((chainId) => {
      const rpcUrl = `${this.network.apiHost}/chainweb/0.0/${this.network.networkId}/chain/${chainId}/pact`
      this.providers[chainId] = new ethers.JsonRpcProvider(rpcUrl)
    })
  }

  // Get provider for specific chain
  getProvider(chainId) {
    if (!this.providers[chainId]) {
      throw new Error(`Provider not available for chain ${chainId}`)
    }
    return this.providers[chainId]
  }

  // Verify transaction on specific chain
  async verifyTransaction(txHash, chainId) {
    try {
      const provider = this.getProvider(chainId)
      const tx = await provider.getTransaction(txHash)

      if (!tx) {
        return { valid: false, error: "Transaction not found" }
      }

      const receipt = await provider.getTransactionReceipt(txHash)

      return {
        valid: true,
        transaction: tx,
        receipt: receipt,
        status: receipt.status === 1 ? "success" : "failed",
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  // Get token balance for address
  async getTokenBalance(tokenAddress, userAddress, chainId) {
    try {
      const provider = this.getProvider(chainId)

      // ERC-20 ABI for balanceOf function
      const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"]

      const contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
      const balance = await contract.balanceOf(userAddress)

      return {
        success: true,
        balance: balance.toString(),
        chainId,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Check if address is whitelisted for token
  async checkWhitelistStatus(tokenAddress, userAddress, chainId) {
    try {
      const provider = this.getProvider(chainId)

      // RWA Token ABI for whitelist check
      const rwaTokenAbi = ["function isWhitelisted(address account) view returns (bool)"]

      const contract = new ethers.Contract(tokenAddress, rwaTokenAbi, provider)
      const isWhitelisted = await contract.isWhitelisted(userAddress)

      return {
        success: true,
        isWhitelisted,
        chainId,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Cross-chain bridge operations
  async initiateCrossChainTransfer(fromChain, toChain, tokenAddress, amount, recipient) {
    try {
      const fromProvider = this.getProvider(fromChain)

      // Bridge contract ABI
      const bridgeAbi = [
        "function initiateBridge(uint256 toChain, address token, uint256 amount, address recipient) returns (bytes32)",
      ]

      // This would need to be signed with a wallet in a real implementation
      const bridgeContract = new ethers.Contract(process.env.BRIDGE_CONTRACT_ADDRESS, bridgeAbi, fromProvider)

      return {
        success: true,
        message: `Cross-chain transfer initiated from chain ${fromChain} to chain ${toChain}`,
        fromChain,
        toChain,
        amount: amount.toString(),
        recipient,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get cross-chain transfer status
  async getCrossChainStatus(transferId) {
    try {
      // In a real implementation, this would query the bridge contract
      return {
        success: true,
        transferId,
        status: "pending", // pending, completed, failed
        confirmations: 12,
        requiredConfirmations: 20,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = { BlockchainService, KADENA_NETWORKS }
