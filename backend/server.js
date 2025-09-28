const express = require("express")
const cors = require("cors")
const multer = require("multer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const { create } = require("ipfs-http-client")
const Arweave = require("arweave")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// File upload configuration
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only PDF and DOC files are allowed."))
    }
  },
})

// IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || "localhost",
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || "http",
})

// Arweave client
const arweave = Arweave.init({
  host: process.env.ARWEAVE_HOST || "arweave.net",
  port: process.env.ARWEAVE_PORT || 443,
  protocol: process.env.ARWEAVE_PROTOCOL || "https",
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/assetlink", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Database Models
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  nationality: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  investorType: { type: String, enum: ["retail", "accredited", "institutional"] },
  annualIncome: String,
  netWorth: String,
  kycStatus: {
    type: String,
    enum: ["not-started", "pending", "approved", "rejected"],
    default: "not-started",
  },
  kycLevel: { type: Number, min: 1, max: 3, default: 1 },
  kycDocuments: [
    {
      type: { type: String, required: true },
      filename: String,
      ipfsHash: String,
      arweaveId: String,
      uploadDate: { type: Date, default: Date.now },
      status: { type: String, enum: ["uploaded", "verified", "rejected"], default: "uploaded" },
    },
  ],
  whitelistStatus: { type: Boolean, default: false },
  approvedBy: String,
  approvalDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const TokenSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  issuer: { type: String, required: true, lowercase: true },
  assetType: String,
  totalAssetValue: Number,
  initialSupply: Number,
  description: String,
  jurisdiction: String,
  assetPassportHash: String,
  assetPassportArweaveId: String,
  deploymentDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  complianceDocuments: [
    {
      type: String,
      filename: String,
      ipfsHash: String,
      arweaveId: String,
      uploadDate: { type: Date, default: Date.now },
    },
  ],
})

const TransactionSchema = new mongoose.Schema({
  txHash: { type: String, required: true, unique: true },
  userAddress: { type: String, required: true, lowercase: true },
  tokenAddress: { type: String, required: true, lowercase: true },
  type: { type: String, enum: ["buy", "sell", "transfer", "bridge"], required: true },
  amount: String,
  price: String,
  totalValue: String,
  fee: String,
  fromChain: String,
  toChain: String,
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  blockNumber: Number,
  timestamp: { type: Date, default: Date.now },
})

const BridgeRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  userAddress: { type: String, required: true, lowercase: true },
  tokenAddress: { type: String, required: true, lowercase: true },
  amount: String,
  sourceChain: String,
  targetChain: String,
  status: { type: String, enum: ["initiated", "processing", "completed", "failed"], default: "initiated" },
  txHash: String,
  completionTxHash: String,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
})

// Create models
const User = mongoose.model("User", UserSchema)
const Token = mongoose.model("Token", TokenSchema)
const Transaction = mongoose.model("Transaction", TransactionSchema)
const BridgeRequest = mongoose.model("BridgeRequest", BridgeRequestSchema)

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

// Routes

// Authentication
app.post("/api/auth/login", async (req, res) => {
  try {
    const { walletAddress, signature } = req.body

    // In a real implementation, verify the signature
    // For demo purposes, we'll create/find the user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })

    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase() })
      await user.save()
    }

    const token = jwt.sign(
      {
        userId: user._id,
        walletAddress: user.walletAddress,
        isAdmin: false,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.json({
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        kycStatus: user.kycStatus,
        whitelistStatus: user.whitelistStatus,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// KYC Routes
app.get("/api/kyc/status", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      kycStatus: user.kycStatus,
      kycLevel: user.kycLevel,
      whitelistStatus: user.whitelistStatus,
      documents: user.kycDocuments,
      approvedBy: user.approvedBy,
      approvalDate: user.approvalDate,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/kyc/submit", authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      nationality,
      address,
      city,
      postalCode,
      country,
      investorType,
      annualIncome,
      netWorth,
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        address,
        city,
        postalCode,
        country,
        investorType,
        annualIncome,
        netWorth,
        kycStatus: "pending",
        updatedAt: new Date(),
      },
      { new: true },
    )

    res.json({
      message: "KYC information submitted successfully",
      kycStatus: user.kycStatus,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/kyc/upload-document", authenticateToken, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const { documentType } = req.body

    // Upload to IPFS
    const ipfsResult = await ipfs.add(req.file.buffer)
    const ipfsHash = ipfsResult.path

    // Optionally upload to Arweave for permanent storage
    let arweaveId = null
    if (process.env.ARWEAVE_WALLET_KEY) {
      const transaction = await arweave.createTransaction({
        data: req.file.buffer,
      })

      transaction.addTag("Content-Type", req.file.mimetype)
      transaction.addTag("Document-Type", documentType)
      transaction.addTag("User-Address", req.user.walletAddress)

      await arweave.transactions.sign(transaction, JSON.parse(process.env.ARWEAVE_WALLET_KEY))
      await arweave.transactions.post(transaction)
      arweaveId = transaction.id
    }

    // Update user document
    const user = await User.findById(req.user.userId)
    user.kycDocuments.push({
      type: documentType,
      filename: req.file.originalname,
      ipfsHash,
      arweaveId,
      status: "uploaded",
    })
    await user.save()

    res.json({
      message: "Document uploaded successfully",
      ipfsHash,
      arweaveId,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin KYC approval routes
app.get("/api/admin/kyc/pending", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ kycStatus: "pending" }).select("-__v").sort({ updatedAt: -1 })

    res.json(pendingUsers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/admin/kyc/approve", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, kycLevel = 1 } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      {
        kycStatus: "approved",
        kycLevel,
        whitelistStatus: true,
        approvedBy: req.user.walletAddress,
        approvalDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "KYC approved successfully",
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        kycStatus: user.kycStatus,
        kycLevel: user.kycLevel,
        whitelistStatus: user.whitelistStatus,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/admin/kyc/reject", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, reason } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      {
        kycStatus: "rejected",
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "KYC rejected",
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        kycStatus: user.kycStatus,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Token management routes
app.post("/api/tokens/register", authenticateToken, async (req, res) => {
  try {
    const {
      contractAddress,
      name,
      symbol,
      assetType,
      totalAssetValue,
      initialSupply,
      description,
      jurisdiction,
      assetPassportHash,
      assetPassportArweaveId,
    } = req.body

    const token = new Token({
      contractAddress: contractAddress.toLowerCase(),
      name,
      symbol,
      issuer: req.user.walletAddress,
      assetType,
      totalAssetValue,
      initialSupply,
      description,
      jurisdiction,
      assetPassportHash,
      assetPassportArweaveId,
    })

    await token.save()

    res.json({
      message: "Token registered successfully",
      tokenId: token._id,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/tokens", async (req, res) => {
  try {
    const { assetType, issuer } = req.query
    const filter = { isActive: true }

    if (assetType && assetType !== "all") {
      filter.assetType = assetType
    }

    if (issuer) {
      filter.issuer = issuer.toLowerCase()
    }

    const tokens = await Token.find(filter).select("-__v").sort({ deploymentDate: -1 })

    res.json(tokens)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/tokens/:contractAddress", async (req, res) => {
  try {
    const token = await Token.findOne({
      contractAddress: req.params.contractAddress.toLowerCase(),
    })

    if (!token) {
      return res.status(404).json({ error: "Token not found" })
    }

    res.json(token)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Transaction tracking
app.post("/api/transactions", authenticateToken, async (req, res) => {
  try {
    const { txHash, tokenAddress, type, amount, price, totalValue, fee, fromChain, toChain, blockNumber } = req.body

    const transaction = new Transaction({
      txHash,
      userAddress: req.user.walletAddress,
      tokenAddress: tokenAddress.toLowerCase(),
      type,
      amount,
      price,
      totalValue,
      fee,
      fromChain,
      toChain,
      blockNumber,
      status: "pending",
    })

    await transaction.save()

    res.json({
      message: "Transaction recorded",
      transactionId: transaction._id,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/transactions", authenticateToken, async (req, res) => {
  try {
    const { type, status, limit = 50 } = req.query
    const filter = { userAddress: req.user.walletAddress }

    if (type && type !== "all") {
      filter.type = type
    }

    if (status && status !== "all") {
      filter.status = status
    }

    const transactions = await Transaction.find(filter)
      .populate("tokenAddress", "name symbol")
      .sort({ timestamp: -1 })
      .limit(Number.parseInt(limit))

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bridge request management
app.post("/api/bridge/initiate", authenticateToken, async (req, res) => {
  try {
    const { requestId, tokenAddress, amount, sourceChain, targetChain } = req.body

    const bridgeRequest = new BridgeRequest({
      requestId,
      userAddress: req.user.walletAddress,
      tokenAddress: tokenAddress.toLowerCase(),
      amount,
      sourceChain,
      targetChain,
      status: "initiated",
    })

    await bridgeRequest.save()

    res.json({
      message: "Bridge request initiated",
      requestId: bridgeRequest.requestId,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/bridge/requests", authenticateToken, async (req, res) => {
  try {
    const requests = await BridgeRequest.find({
      userAddress: req.user.walletAddress,
    })
      .populate("tokenAddress", "name symbol")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Whitelist management
app.get("/api/whitelist", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status = "all", kycLevel } = req.query
    const filter = {}

    if (status !== "all") {
      filter.whitelistStatus = status === "approved"
    }

    if (kycLevel) {
      filter.kycLevel = Number.parseInt(kycLevel)
    }

    const users = await User.find(filter)
      .select("walletAddress email firstName lastName kycStatus kycLevel whitelistStatus approvalDate")
      .sort({ approvalDate: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      ipfs: "available",
      arweave: "available",
    },
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
    }
  }

  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`AssetLink Backend API running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
