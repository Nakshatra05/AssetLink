const express = require("express")
const { BlockchainService } = require("../utils/blockchain")
const { uploadToIPFS } = require("../utils/ipfs")
const router = express.Router()

const blockchain = new BlockchainService()

// Get all available RWA tokens
router.get("/", async (req, res) => {
  try {
    // In a real implementation, this would query the database
    const tokens = [
      {
        id: "rwa_001",
        name: "Manhattan Real Estate Token",
        symbol: "MRET",
        address: "0x1234567890123456789012345678901234567890",
        chainId: 0,
        totalSupply: "1000000",
        price: "100.00",
        assetType: "Real Estate",
        location: "Manhattan, NY",
        description: "Tokenized commercial real estate in Manhattan",
        documents: {
          assetPassport: "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
          legalDocs: "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy",
        },
      },
      {
        id: "rwa_002",
        name: "Gold Bullion Token",
        symbol: "GBT",
        address: "0x2345678901234567890123456789012345678901",
        chainId: 1,
        totalSupply: "500000",
        price: "65.50",
        assetType: "Precious Metals",
        location: "Swiss Vault",
        description: "Tokenized gold bullion stored in Swiss vaults",
        documents: {
          assetPassport: "QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz",
          legalDocs: "QmAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa",
        },
      },
    ]

    res.json({
      success: true,
      tokens,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get token details
router.get("/:tokenId", async (req, res) => {
  try {
    const { tokenId } = req.params

    // Mock token data - in real implementation, query database
    const token = {
      id: tokenId,
      name: "Manhattan Real Estate Token",
      symbol: "MRET",
      address: "0x1234567890123456789012345678901234567890",
      chainId: 0,
      totalSupply: "1000000",
      circulatingSupply: "750000",
      price: "100.00",
      marketCap: "75000000",
      assetType: "Real Estate",
      location: "Manhattan, NY",
      description: "Tokenized commercial real estate in Manhattan",
      performance: {
        "24h": "+2.5%",
        "7d": "+8.3%",
        "30d": "+15.7%",
      },
    }

    res.json({
      success: true,
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get user's token portfolio
router.get("/portfolio/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    // Mock portfolio data
    const portfolio = [
      {
        tokenId: "rwa_001",
        name: "Manhattan Real Estate Token",
        symbol: "MRET",
        balance: "1500",
        value: "150000",
        chainId: 0,
      },
      {
        tokenId: "rwa_002",
        name: "Gold Bullion Token",
        symbol: "GBT",
        balance: "500",
        value: "32750",
        chainId: 1,
      },
    ]

    const totalValue = portfolio.reduce((sum, token) => sum + Number.parseFloat(token.value), 0)

    res.json({
      success: true,
      portfolio,
      totalValue: totalValue.toString(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
