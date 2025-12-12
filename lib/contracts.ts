import { ethers } from "ethers"
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, GANACHE_CHAIN_ID } from "./web3-config"

// Contract ABIs - angepasst für HSLU Module Review DApp
// Using full function signatures for better compatibility
export const MODULE_REVIEWS_ABI = [
  "function getAllModuleIds() view returns (string[])",
  "function addModule(string _id)",
  "function addReview(string _moduleId, uint8 _rating, uint8 _workload, uint8 _difficulty, string _comment)",
  "function getReviews(string _moduleId) view returns (tuple(address reviewer, uint8 rating, uint8 workload, uint8 difficulty, string comment, uint256 timestamp)[])",
  "event ModuleAdded(string id)",
  "event ReviewAdded(string indexed moduleId, address indexed reviewer, uint8 rating)",
]

export const STUDENT_IDENTITY_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function owner() external view returns (address)",
  "function issueBadge(address student) public",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]

// Helper to switch to Ganache network
export async function switchToGanacheNetwork() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not detected")
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    })
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add the network to MetaMask
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_CONFIG],
        })
      } catch (addError) {
        console.error("[HSLU] Failed to add network:", addError)
        throw addError
      }
    } else {
      console.error("[HSLU] Failed to switch network:", switchError)
      throw switchError
    }
  }
}

// Helper to check and switch network if needed
export async function ensureGanacheNetwork() {
  if (typeof window === "undefined" || !window.ethereum) {
    return false
  }

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" })
    const expectedChainId = NETWORK_CONFIG.chainId.toLowerCase()
    
    if (chainId.toLowerCase() !== expectedChainId) {
      await switchToGanacheNetwork()
      return true
    }
    return true
  } catch (error) {
    console.error("[HSLU] Error checking network:", error)
    return false
  }
}

// Helper to get provider
export function getProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    return null
  }
  return new ethers.BrowserProvider(window.ethereum)
}

// Helper to get signer
export async function getSigner() {
  const provider = getProvider()
  if (!provider) return null
  return await provider.getSigner()
}

// Get contract instances
export async function getModuleReviewsContract(withSigner = false) {
  const address = CONTRACT_ADDRESSES.MODULE_REVIEWS
  if (!address) {
    console.warn("[HSLU] ModuleReviews contract address not configured")
    console.warn("[HSLU] Check .env.local file for NEXT_PUBLIC_MODULE_REVIEWS_ADDRESS")
    return null
  }

  console.log("[HSLU] Creating ModuleReviews contract instance at:", address)

  if (withSigner) {
    const signer = await getSigner()
    if (!signer) {
      console.warn("[HSLU] No signer available - MetaMask not connected")
      return null
    }
    return new ethers.Contract(address, MODULE_REVIEWS_ABI, signer)
  } else {
    const provider = getProvider()
    if (!provider) {
      console.warn("[HSLU] No provider available - MetaMask not detected")
      return null
    }
    return new ethers.Contract(address, MODULE_REVIEWS_ABI, provider)
  }
}

export async function getStudentIdentityContract(withSigner = false) {
  const address = CONTRACT_ADDRESSES.STUDENT_IDENTITY
  if (!address) {
    console.warn("[HSLU] StudentIdentity contract address not configured")
    return null
  }

  if (withSigner) {
    const signer = await getSigner()
    if (!signer) return null
    return new ethers.Contract(address, STUDENT_IDENTITY_ABI, signer)
  } else {
    const provider = getProvider()
    if (!provider) return null
    return new ethers.Contract(address, STUDENT_IDENTITY_ABI, provider)
  }
}

// Blockchain operations
export async function fetchModulesFromChain() {
  try {
    // Ensure we're on the correct network
    await ensureGanacheNetwork()
    
    const contract = await getModuleReviewsContract()
    if (!contract) {
      return null
    }
    
    // Check if contract exists at address
    const provider = getProvider()
    if (!provider) {
      return null
    }
    
    const code = await provider.getCode(CONTRACT_ADDRESSES.MODULE_REVIEWS)
    if (!code || code === "0x") {
      console.error("[HSLU] No contract code found. Make sure you're connected to Ganache (Chain ID: 1337)")
      return null
    }
    
    const moduleIds = await contract.getAllModuleIds()

    // Handle empty array case
    if (!moduleIds || moduleIds.length === 0) {
      return []
    }

    // Fetch reviews for each module to calculate averages
    const modulesWithData = await Promise.all(
      moduleIds.map(async (id: string) => {
        try {
          const reviews = await contract.getReviews(id)
          const totalReviews = reviews.length
          
          // Calculate average rating
          let averageRating = 0
          if (totalReviews > 0) {
            const sum = reviews.reduce((acc: bigint, r: any) => acc + BigInt(r.rating), 0n)
            averageRating = Number(sum) / totalReviews
          }

          // Calculate average workload and difficulty
          let avgWorkload = 0
          let avgDifficulty = 0
          if (totalReviews > 0) {
            const workloadSum = reviews.reduce((acc: bigint, r: any) => acc + BigInt(r.workload), 0n)
            const difficultySum = reviews.reduce((acc: bigint, r: any) => acc + BigInt(r.difficulty), 0n)
            avgWorkload = Number(workloadSum) / totalReviews
            avgDifficulty = Number(difficultySum) / totalReviews
          }

          // Convert numeric values to string labels
          const workloadLabel = avgWorkload === 0 ? undefined : 
            avgWorkload <= 2 ? 'Low' : avgWorkload <= 3.5 ? 'Medium' : 'High'
          const difficultyLabel = avgDifficulty === 0 ? undefined :
            avgDifficulty <= 2 ? 'Low' : avgDifficulty <= 3.5 ? 'Medium' : 'High'

          return {
            id: id,
            name: id,
            averageRating: averageRating || undefined,
            totalReviews: totalReviews,
            workload: workloadLabel,
            difficulty: difficultyLabel,
          }
        } catch (error) {
          console.error(`[HSLU] Error fetching reviews for module ${id}:`, error)
          return {
            id: id,
            name: id,
            averageRating: undefined,
            totalReviews: 0,
          }
        }
      })
    )

    return modulesWithData
  } catch (error) {
    console.error("[HSLU] Error fetching modules:", error)
    console.error("[HSLU] Error details:", error instanceof Error ? error.message : error)
    return null
  }
}

export async function fetchReviewsForModule(moduleId: string) {
  try {
    const contract = await getModuleReviewsContract()
    if (!contract) {
      return null
    }

    const reviews = await contract.getReviews(moduleId)

    return reviews.map((r: any, index: number) => ({
      id: index,
      moduleId: moduleId,
      reviewer: r.reviewer,
      rating: Number(r.rating),
      workload: Number(r.workload),
      difficulty: Number(r.difficulty),
      comment: r.comment,
      timestamp: Number(r.timestamp),
    }))
  } catch (error) {
    console.error("[HSLU] Error fetching reviews:", error)
    return null
  }
}

export async function addModuleToChain(moduleId: string) {
  try {
    const contract = await getModuleReviewsContract(true)
    if (!contract) {
      throw new Error("ModuleReviews contract not available")
    }

    console.log("[HSLU] Adding module to blockchain...")
    const tx = await contract.addModule(moduleId)
    console.log("[HSLU] Transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("[HSLU] Transaction confirmed:", receipt.hash)

    return receipt
  } catch (error) {
    console.error("[HSLU] Error adding module:", error)
    throw error
  }
}

export async function submitReviewToChain(
  moduleId: string, 
  rating: number, 
  workload: number,
  difficulty: number,
  comment: string
) {
  try {
    const contract = await getModuleReviewsContract(true)
    if (!contract) {
      throw new Error("ModuleReviews contract not available")
    }

    const tx = await contract.addReview(moduleId, rating, workload, difficulty, comment)
    const receipt = await tx.wait()

    return receipt
  } catch (error) {
    console.error("[HSLU] Error submitting review:", error)
    throw error
  }
}

export async function checkVerificationStatus(walletAddress: string): Promise<boolean> {
  try {
    const contract = await getStudentIdentityContract()
    if (!contract) {
      return false
    }

    const balance = await contract.balanceOf(walletAddress)
    const isVerified = balance > 0n

    return isVerified
  } catch (error) {
    console.error("[HSLU] Error checking verification:", error)
    return false
  }
}

export async function issueBadgeToStudent(studentAddress: string) {
  try {
    const contract = await getStudentIdentityContract(true)
    if (!contract) {
      throw new Error("StudentIdentity contract not available")
    }

    const tx = await contract.issueBadge(studentAddress)
    const receipt = await tx.wait()

    return receipt
  } catch (error) {
    console.error("[HSLU] Error issuing badge:", error)
    throw error
  }
}

export async function getAllVerifiedStudents() {
  try {
    const contract = await getStudentIdentityContract()
    if (!contract) {
      console.warn("[HSLU] StudentIdentity contract not available")
      return []
    }

    const provider = getProvider()
    if (!provider) {
      return []
    }

    // Filter Transfer events where from is address(0) (minting events)
    const filter = contract.filters.Transfer(null, null, null)
    const events = await contract.queryFilter(filter)

    // Get all mint events (from == address(0))
    const students: Array<{ address: string; tokenId: number }> = []
    for (const event of events) {
      if ('args' in event && event.args) {
        const from = event.args[0] as string
        const to = event.args[1] as string
        const tokenId = event.args[2] as bigint
        if (from === "0x0000000000000000000000000000000000000000") {
          students.push({
            address: to,
            tokenId: Number(tokenId),
          })
        }
      }
    }

    return students
  } catch (error) {
    console.error("[HSLU] Error fetching verified students:", error)
    return []
  }
}

export async function getStudentTokenId(studentAddress: string): Promise<number | null> {
  try {
    const contract = await getStudentIdentityContract()
    if (!contract) {
      return null
    }

    // Filter Transfer events for this address
    const filter = contract.filters.Transfer(null, studentAddress, null)
    const events = await contract.queryFilter(filter)
    
    // Find the mint event (from == address(0))
    for (const event of events) {
      if ('args' in event && event.args) {
        const from = event.args[0] as string
        const tokenId = event.args[2] as bigint
        if (from === "0x0000000000000000000000000000000000000000") {
          return Number(tokenId)
        }
      }
    }
    return null
  } catch (error) {
    console.error("[HSLU] Error getting token ID:", error)
    return null
  }
}

export async function getTokenURI(tokenId: number): Promise<string | null> {
  try {
    const contract = await getStudentIdentityContract()
    if (!contract) {
      return null
    }

    const uri = await contract.tokenURI(tokenId)
    return uri
  } catch (error) {
    console.error("[HSLU] Error getting token URI:", error)
    return null
  }
}
