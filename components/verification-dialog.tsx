"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendVerificationCode, verifyCode } from "@/lib/verification-stub"
import { issueBadgeToStudent } from "@/lib/contracts"

interface VerificationDialogProps {
  wallet: string
  onVerified: () => void
}

export function VerificationDialog({ wallet, onVerified }: VerificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"email" | "code" | "success">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Show info message instead of email stub
    toast({
      title: "Manual Verification Required",
      description: "Please contact the contract owner at marcel.christen@stud.hslu.ch to get verified.",
    })
    
    setLoading(false)
    setOpen(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const isValid = await verifyCode(email, wallet, code)

      if (isValid) {
        toast({
          title: "Email verified!",
          description: "Minting your HSLU Student NFT badge...",
        })
        setStep("success")

        try {
          // Mint the badge on-chain using the real contract
          // Note: This requires the connected wallet to be the Owner of the StudentIdentity contract
          const receipt = await issueBadgeToStudent(wallet)

          onVerified()
          setOpen(false)
          toast({
            title: "Badge minted!",
            description: `Transaction: ${receipt.hash.slice(0, 10)}...`,
          })
          // Reset
          setStep("email")
          setEmail("")
          setCode("")
        } catch (error: any) {
          console.error("[HSLU] Error minting badge:", error)
          let errorMessage = error.message || "Failed to mint badge."
          
          // Check if it's a permission error
          if (error.message && error.message.includes("onlyOwner") || error.message.includes("Ownable")) {
            errorMessage = "Only the contract owner can issue badges. Please contact an administrator or use the owner account."
          } else if (error.message && error.message.includes("already verified")) {
            errorMessage = "You already have a badge! You are verified."
            // Still mark as verified
            onVerified()
            setOpen(false)
            setStep("email")
            setEmail("")
            setCode("")
            setLoading(false)
            return
          }
          
          setError(errorMessage)
          setStep("code")
          setLoading(false)
        }
      }
    } catch (error: any) {
      setError(error.message)
      setStep("code") // Stay on code step
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Get Verified</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center">
            {step === "email" && "Verify HSLU Student Status"}
            {step === "code" && "Enter Verification Code"}
            {step === "success" && "Verification Complete!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "email" && "Get a Soul-Bound NFT badge to prove you're an HSLU student"}
            {step === "code" && `We sent a 6-digit code to ${email}`}
            {step === "success" && "Your verification badge is being minted on the blockchain"}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium">Manual Verification Required</p>
                  <p className="text-sm text-muted-foreground">
                    To get verified as an HSLU student, please contact the contract owner:
                  </p>
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <p className="font-mono text-sm">marcel.christen@stud.hslu.ch</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The owner will issue you a verification badge (Soul-Bound Token) that proves your student status.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Connected Wallet</Label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm">{wallet}</div>
              <p className="text-xs text-muted-foreground">
                Share this address with the owner when requesting verification.
              </p>
            </div>

            <Button 
              type="button" 
              className="w-full" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                required
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                {loading ? "Verifying..." : "Verify & Mint Badge"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("email")}>
                Use different email
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">Code expires in 5 minutes</p>
          </form>
        )}

        {step === "success" && (
          <div className="py-6 space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-chart-3/10 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-chart-3" />
            </div>

            <div className="space-y-2 text-center">
              <h3 className="font-semibold text-lg">NFT Badge Minting...</h3>
              <p className="text-sm text-muted-foreground">
                Your Soul-Bound Token is being created. This may take a few seconds.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
