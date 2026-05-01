import { ZgFile, Indexer } from '@0gfoundation/0g-ts-sdk'
import { ethers } from 'ethers'
import 'dotenv/config'
import * as crypto from 'crypto'

// Initialize provider and signer
const RPC_URL = process.env.RPC_URL
const INDEXER_RPC = process.env.INDEXER_RPC
const indexer = new Indexer(INDEXER_RPC)
const provider = new ethers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

async function uploadFile(filePath) {
  // save this: there is no server-side recovery
  const key = crypto.randomBytes(32) // Node.js — or crypto.getRandomValues in browser

  const file = await ZgFile.fromFilePath(filePath)
  const [tx, err] = await indexer.upload(file, RPC_URL, signer, {
    encryption: { type: 'aes256', key },
  })

  // Download + decrypt
  const [blob, dlErr] = await indexer.downloadToBlob(tx.rootHash, {
    proof: true,
    decryption: { symmetricKey: key },
  })
}

async function main() {
  const result = await uploadFile('./secret.txt')
  console.log('Upload result:', result)
}

main()
