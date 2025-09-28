const express = require("express")
const multer = require("multer")
const { validateKYC } = require("../middleware/validation")
const { uploadToIPFS } = require("../utils/ipfs")
const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."))
    }
  },
})

// Submit KYC documents
router.post(
  "/submit",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "proofOfAddress", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  validateKYC,
  async (req, res) => {
    try {
      const { personalInfo, investorType, riskProfile } = req.body
      const files = req.files

      // Upload documents to IPFS
      const documentHashes = {}
      for (const [fieldName, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray[0]) {
          const hash = await uploadToIPFS(fileArray[0].buffer)
          documentHashes[fieldName] = hash
        }
      }

      // In a real implementation, this would save to database
      const kycSubmission = {
        id: `kyc_${Date.now()}`,
        userId: req.body.userId,
        personalInfo: JSON.parse(personalInfo),
        investorType,
        riskProfile,
        documents: documentHashes,
        status: "pending",
        submittedAt: new Date().toISOString(),
      }

      res.json({
        success: true,
        message: "KYC documents submitted successfully",
        submissionId: kycSubmission.id,
        status: "pending",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  },
)

// Get KYC status
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    // In a real implementation, this would query the database
    const kycStatus = {
      userId,
      status: "approved", // pending, approved, rejected, requires_review
      approvedAt: new Date().toISOString(),
      documents: {
        idDocument: "verified",
        proofOfAddress: "verified",
        selfie: "verified",
      },
    }

    res.json({
      success: true,
      kyc: kycStatus,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
