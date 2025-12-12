// This simulates the verification flow without requiring backend infrastructure

export interface VerificationState {
  step: "email" | "code" | "minting" | "success"
  email?: string
  code?: string
  txHash?: string
}

// Store verification codes in memory (dev only)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

export async function sendVerificationCode(email: string, walletAddress: string): Promise<boolean> {
  // Validate HSLU email
  if (!email.endsWith("@stud.hslu.ch")) {
    throw new Error("Only @stud.hslu.ch emails are allowed")
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

  // Store code
  const key = `${email}:${walletAddress}`
  verificationCodes.set(key, { code, expiresAt })

  // In production, this would call your backend API
  console.log("[HSLU] Verification code (STUB):", code)
  console.log("[HSLU] In production, this would be sent via email to:", email)

  // Show code in console for testing
  alert(`DEVELOPMENT MODE: Your verification code is: ${code}\n\nIn production, this would be sent to ${email}`)

  return true
}

export async function verifyCode(email: string, walletAddress: string, code: string): Promise<boolean> {
  const key = `${email}:${walletAddress}`
  const stored = verificationCodes.get(key)

  if (!stored) {
    throw new Error("No verification code found. Please request a new one.")
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(key)
    throw new Error("Verification code expired. Please request a new one.")
  }

  if (stored.code !== code) {
    throw new Error("Invalid verification code")
  }

  // Code is valid
  verificationCodes.delete(key)
  console.log("[HSLU] Code verified successfully")

  return true
}

export async function mintVerificationBadge(walletAddress: string, email: string): Promise<string> {
  // In production, this would call your backend which mints the NFT
  console.log("[HSLU] Minting verification badge (STUB) for:", walletAddress)

  // Simulate blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate fake transaction hash
  const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

  console.log("[HSLU] Badge minted (STUB). Transaction hash:", txHash)
  console.log("[HSLU] In production, this would be a real on-chain transaction")

  // Store verification in localStorage for persistence
  const verifiedWallets = JSON.parse(localStorage.getItem("verifiedWallets") || "[]")
  if (!verifiedWallets.includes(walletAddress.toLowerCase())) {
    verifiedWallets.push(walletAddress.toLowerCase())
    localStorage.setItem("verifiedWallets", JSON.stringify(verifiedWallets))
  }

  return txHash
}

export function isWalletVerified(walletAddress: string): boolean {
  // Check localStorage for stub verification
  const verifiedWallets = JSON.parse(localStorage.getItem("verifiedWallets") || "[]")
  return verifiedWallets.includes(walletAddress.toLowerCase())
}

export function clearVerification(walletAddress: string): void {
  const verifiedWallets = JSON.parse(localStorage.getItem("verifiedWallets") || "[]")
  const filtered = verifiedWallets.filter((w: string) => w !== walletAddress.toLowerCase())
  localStorage.setItem("verifiedWallets", JSON.stringify(filtered))
}
