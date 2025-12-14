"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { issueBadgeToStudent } from "@/lib/contracts"
import { Shield, CheckCircle } from "lucide-react"

interface AdminBadgeIssuerProps {
  onBadgeIssued?: () => void
}

export function AdminBadgeIssuer({ onBadgeIssued }: AdminBadgeIssuerProps) {
  const [studentAddress, setStudentAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleIssueBadge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!studentAddress || !studentAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const receipt = await issueBadgeToStudent(studentAddress)
      toast({
        title: "Badge Issued!",
        description: `Transaction: ${receipt.hash.slice(0, 10)}...`,
      })
      setStudentAddress("")
      onBadgeIssued?.()
    } catch (error: any) {
      console.error("[admin] Error issuing badge:", error)
      let errorMessage = error.message || "Failed to issue badge"
      
      if (error.message && error.message.includes("already verified")) {
        errorMessage = "This student already has a badge!"
      } else if (error.message && (error.message.includes("onlyOwner") || error.message.includes("Ownable"))) {
        errorMessage = "Only the contract owner can issue badges. Make sure you're connected with the owner account."
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Issue Student Badge
        </CardTitle>
        <CardDescription>
          Enter a student wallet address to issue a verification badge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleIssueBadge} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentAddress">Student Wallet Address</Label>
            <Input
              id="studentAddress"
              type="text"
              placeholder="0x..."
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address of the student who should receive the badge.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Issuing Badge...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Issue Badge
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

