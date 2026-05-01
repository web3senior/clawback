import { ZgFile, Indexer, MemData } from '@0gfoundation/0g-ts-sdk'
import { ethers } from 'ethers'
import 'dotenv/config'

// Initialize 0G SDK with your network configuration
// Network endpoints — see network overview docs for current values
// Turbo indexer (recommended):
const RPC_URL = process.env.RPC_URL
const INDEXER_RPC = process.env.INDEXER_RPC

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

// Initialize indexer — flow contract is auto-discovered
const indexer = new Indexer(INDEXER_RPC)

async function uploadFile(filePath) {
  const file = await ZgFile.fromFilePath(filePath)

  // Must call merkleTree() before upload — populates internal state
  const [tree, treeErr] = await file.merkleTree()
  if (treeErr !== null) throw new Error(`Merkle tree error: ${treeErr}`)

  console.log('Root Hash:', tree?.rootHash())

  const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer)
  if (uploadErr !== null) throw new Error(`Upload error: ${uploadErr}`)

  await file.close() // Always close when done

  // Handle both single and fragmented (>4GB) responses
  if ('rootHash' in tx) {
    return { rootHash: tx.rootHash, txHash: tx.txHash }
  } else {
    return { rootHashes: tx.rootHashes, txHashes: tx.txHashes }
  }
}

async function main() {
  const result = await uploadFile('./example.txt')
  console.log('Upload result:', result)
}

main()
