import { ZgFile, Indexer, MemData } from "@0gfoundation/0g-ts-sdk";
import { ethers } from "ethers";
import "dotenv/config";

// Initialize 0G SDK with your network configuration
// Network endpoints — see network overview docs for current values
// Turbo indexer (recommended):
const RPC_URL = process.env.RPC_URL;
const INDEXER_RPC = process.env.INDEXER_RPC;

// Initialize indexer — flow contract is auto-discovered
const indexer = new Indexer(INDEXER_RPC);

async function downloadFromIndexer(rootHash, outputPath) {
  // withProof = true enables Merkle proof verification
  const err = await indexer.download(rootHash, outputPath, true);
  if (err !== null) {
    throw new Error(`Download error: ${err}`);
  }
  console.log("Download successful!");
}

async function main() {
  const result = await downloadFromIndexer(
    "0xfcf65a711c6ade341e2963a095e3107da38380eae28377e318fd3236d1a9e406",
    "./downloaded.png",
  );
  console.log("Upload result:", result);
}

main();
