const { create } = require("ipfs-http-client")

// Initialize IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || "localhost",
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || "http",
})

// Upload file to IPFS
async function uploadToIPFS(fileBuffer, fileName = "document") {
  try {
    const result = await ipfs.add({
      path: fileName,
      content: fileBuffer,
    })

    return result.cid.toString()
  } catch (error) {
    throw new Error(`IPFS upload failed: ${error.message}`)
  }
}

// Retrieve file from IPFS
async function getFromIPFS(hash) {
  try {
    const chunks = []
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  } catch (error) {
    throw new Error(`IPFS retrieval failed: ${error.message}`)
  }
}

// Upload JSON metadata to IPFS
async function uploadMetadataToIPFS(metadata) {
  try {
    const result = await ipfs.add({
      path: "metadata.json",
      content: JSON.stringify(metadata, null, 2),
    })

    return result.cid.toString()
  } catch (error) {
    throw new Error(`IPFS metadata upload failed: ${error.message}`)
  }
}

module.exports = {
  uploadToIPFS,
  getFromIPFS,
  uploadMetadataToIPFS,
}
