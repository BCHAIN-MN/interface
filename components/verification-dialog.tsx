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
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, Copy, Check } from "lucide-react"

interface VerificationDialogProps {
  wallet: string
  onVerified: () => void
}

export function VerificationDialog({ wallet, onVerified }: VerificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (!wallet) return
    
    try {
      await navigator.clipboard.writeText(wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[HSLU] Failed to copy address:', err)
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
            Verify HSLU Student Status
          </DialogTitle>
          <DialogDescription className="text-center">
            Get a Soul-Bound NFT badge to prove you're an HSLU student
          </DialogDescription>
        </DialogHeader>

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
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {wallet}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
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
      </DialogContent>
    </Dialog>
  )
}
