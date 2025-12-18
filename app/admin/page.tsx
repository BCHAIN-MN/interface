"use client"

import { useState, useEffect } from "react"
import { AdminBadgeIssuer } from "@/components/admin-badge-issuer"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentIdentityContract, checkVerificationStatus, getAllVerifiedStudents } from "@/lib/contracts"
import { Shield, Users, CheckCircle, XCircle, Badge } from "lucide-react"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState<boolean | null>(null)
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
  const [verifiedStudents, setVerifiedStudents] = useState<Array<{ address: string; tokenId: number }>>([])
  const [loading, setLoading] = useState(false)

  const handleWalletChange = (newWallet: string | null, isVerified?: boolean) => {
    setWallet(newWallet)
    if (newWallet) {
      checkOwnerStatus(newWallet)
    } else {
      setIsOwner(null)
      setVerifiedStudents([])
    }
  }

  const fetchOwnerAddress = async () => {
    try {
      const contract = await getStudentIdentityContract(false)
      if (!contract) {
        console.warn("[admin] Could not get contract instance")
        return
      }

      const owner = await contract.owner()
      setOwnerAddress(owner)
    } catch (error) {
      console.error("[admin] Error fetching owner address:", error)
    }
  }

  const checkOwnerStatus = async (address: string) => {
    try {
      const contract = await getStudentIdentityContract()
      if (!contract) {
        setIsOwner(false)
        return
      }

      const owner = await contract.owner()
      setIsOwner(owner.toLowerCase() === address.toLowerCase())
    } catch (error) {
      console.error("[admin] Error checking owner:", error)
      setIsOwner(false)
    }
  }

  useEffect(() => {
    fetchOwnerAddress()
  }, [])

  const loadVerifiedStudents = async () => {
    setLoading(true)
    try {
      const students = await getAllVerifiedStudents()
      setVerifiedStudents(students)
      console.log("[admin] Loaded verified students:", students)
    } catch (error) {
      console.error("[admin] Error loading verified students:", error)
    } finally {
      setLoading(false)
    }
  }

  // Removed automatic loading - only on button click

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HSLU Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Badge Management</p>
            </div>
          </div>
          <WalletConnect onWalletChange={handleWalletChange} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Owner Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {wallet && isOwner !== null ? (
                  isOwner ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>You are the Contract Owner</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>You are NOT the Contract Owner</span>
                    </>
                  )
                ) : (
                  <span>Contract Owner Information</span>
                )}
              </CardTitle>
              <CardDescription>
                {wallet && isOwner !== null
                  ? isOwner
                    ? "You can issue badges to students."
                    : "Only the contract owner can issue badges. Connect with the owner account (first Ganache account)."
                  : "Connect your wallet to check if you are the contract owner."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contract Owner Address */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Contract Owner Address</p>
                {ownerAddress ? (
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <p className="text-sm font-mono">{ownerAddress}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                )}
              </div>

              {/* Connected Wallet Address */}
              {wallet && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Connected Wallet Address</p>
                  <div
                    className={`p-3 rounded-lg border ${
                      isOwner === true
                        ? "bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400"
                        : isOwner === false
                        ? "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-400"
                        : "bg-muted border-border"
                    }`}
                  >
                    <p className="text-sm font-mono">{wallet}</p>
                  </div>
                  {isOwner === true && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      This wallet matches the contract owner address.
                    </p>
                  )}
                  {isOwner === false && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      This wallet does not match the contract owner address.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badge Issuer */}
          {wallet && isOwner && (
            <AdminBadgeIssuer onBadgeIssued={loadVerifiedStudents} />
          )}

          {/* Verified Students List */}
          {wallet && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Verified Students
                    </CardTitle>
                    <CardDescription>
                      List of students who have been issued badges
                    </CardDescription>
                  </div>
                  <Button onClick={() => loadVerifiedStudents()} variant="outline" size="sm" disabled={loading}>
                    {loading ? "Loading..." : "Refresh List"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : verifiedStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No verified students found.</p>
                ) : (
                  <div className="space-y-2">
                    {verifiedStudents.map((student) => (
                      <div
                        key={student.address}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-mono">{student.address}</span>
                            <span className="text-xs text-muted-foreground">Token ID: {student.tokenId}</span>
                          </div>
                        </div>
                        <BadgeComponent variant="secondary" className="text-xs">Verified</BadgeComponent>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!wallet && (
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with the contract owner account (first account from Ganache).
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Issue Badges</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a student wallet address and click "Issue Badge" to mint a verification badge.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. View Verified Students</h3>
                  <p className="text-sm text-muted-foreground">
                    See all students who have been issued badges.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    The contract owner address is displayed above. Use that account to issue badges.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}

