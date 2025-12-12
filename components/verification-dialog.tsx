'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email.endsWith('@hslu.ch')) {
      setError('Please use your HSLU email address (@hslu.ch)')
      setLoading(false)
      return
    }

    // Here you would call your backend API
    setTimeout(() => {
      toast({
        title: 'Verification code sent!',
        description: `Check your email at ${email}`,
      })
      setStep('code')
      setLoading(false)
    }, 1500)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Here you would verify the code with your backend
    setTimeout(() => {
      toast({
        title: 'Email verified! 🎉',
        description: 'Your HSLU Student NFT badge is being minted...',
      })
      setStep('success')
      setLoading(false)
      
      // After NFT is minted
      setTimeout(() => {
        onVerified()
        setOpen(false)
        toast({
          title: 'Badge minted! ✨',
          description: 'You are now a verified HSLU student',
        })
        // Reset
        setStep('email')
        setEmail('')
        setCode('')
      }, 2000)
    }, 1500)
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
            {step === 'email' && 'Verify HSLU Student Status'}
            {step === 'code' && 'Enter Verification Code'}
            {step === 'success' && 'Verification Complete!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'email' && 'Get a Soul-Bound NFT badge to prove you\'re an HSLU student'}
            {step === 'code' && `We sent a 6-digit code to ${email}`}
            {step === 'success' && 'Your verification badge is being minted on the blockchain'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">HSLU Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@hslu.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Connected Wallet</Label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                {wallet}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your email will be hashed and only the hash will be stored on-chain for privacy
            </p>
          </form>
        )}

        {step === 'code' && (
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
                {loading ? 'Verifying...' : 'Verify & Mint Badge'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('email')}
              >
                Use different email
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Code expires in 5 minutes
            </p>
          </form>
        )}

        {step === 'success' && (
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
