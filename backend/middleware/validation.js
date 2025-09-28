const { body, param, query, validationResult } = require("express-validator")

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    })
  }
  next()
}

// KYC validation rules
const kycSubmissionValidation = [
  body("firstName").trim().isLength({ min: 1, max: 50 }).withMessage("First name is required"),
  body("lastName").trim().isLength({ min: 1, max: 50 }).withMessage("Last name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").isMobilePhone().withMessage("Valid phone number is required"),
  body("dateOfBirth").isISO8601().withMessage("Valid date of birth is required"),
  body("nationality").isLength({ min: 2, max: 2 }).withMessage("Valid nationality code is required"),
  body("address").trim().isLength({ min: 5, max: 200 }).withMessage("Valid address is required"),
  body("city").trim().isLength({ min: 1, max: 100 }).withMessage("City is required"),
  body("postalCode").trim().isLength({ min: 3, max: 20 }).withMessage("Valid postal code is required"),
  body("country").isLength({ min: 2, max: 2 }).withMessage("Valid country code is required"),
  body("investorType").isIn(["retail", "accredited", "institutional"]).withMessage("Valid investor type is required"),
  validate,
]

// Token registration validation
const tokenRegistrationValidation = [
  body("contractAddress").isEthereumAddress().withMessage("Valid contract address is required"),
  body("name").trim().isLength({ min: 1, max: 100 }).withMessage("Token name is required"),
  body("symbol").trim().isLength({ min: 1, max: 10 }).withMessage("Token symbol is required"),
  body("assetType").trim().isLength({ min: 1, max: 50 }).withMessage("Asset type is required"),
  body("totalAssetValue").isNumeric().withMessage("Total asset value must be numeric"),
  body("initialSupply").isNumeric().withMessage("Initial supply must be numeric"),
  body("jurisdiction").isLength({ min: 2, max: 2 }).withMessage("Valid jurisdiction code is required"),
  validate,
]

// Transaction validation
const transactionValidation = [
  body("txHash").isHash("keccak256").withMessage("Valid transaction hash is required"),
  body("tokenAddress").isEthereumAddress().withMessage("Valid token address is required"),
  body("type").isIn(["buy", "sell", "transfer", "bridge"]).withMessage("Valid transaction type is required"),
  body("amount").isNumeric().withMessage("Amount must be numeric"),
  validate,
]

// Bridge request validation
const bridgeRequestValidation = [
  body("requestId").isHash("keccak256").withMessage("Valid request ID is required"),
  body("tokenAddress").isEthereumAddress().withMessage("Valid token address is required"),
  body("amount").isNumeric().withMessage("Amount must be numeric"),
  body("sourceChain").isNumeric().withMessage("Source chain must be numeric"),
  body("targetChain").isNumeric().withMessage("Target chain must be numeric"),
  validate,
]

// Admin validation
const adminApprovalValidation = [
  body("userId").isMongoId().withMessage("Valid user ID is required"),
  body("kycLevel").optional().isInt({ min: 1, max: 3 }).withMessage("KYC level must be 1, 2, or 3"),
  validate,
]

// Query parameter validation
const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  validate,
]

module.exports = {
  validate,
  kycSubmissionValidation,
  tokenRegistrationValidation,
  transactionValidation,
  bridgeRequestValidation,
  adminApprovalValidation,
  paginationValidation,
}
