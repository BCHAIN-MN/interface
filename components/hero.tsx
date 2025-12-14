'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ArrowRight, Shield, Users, Award, AlertCircle, Copy, Check } from 'lucide-react'

interface HeroProps {
  wallet?: string | null
}

export function Hero({ wallet }: HeroProps) {
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false)
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
    <section className="container mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Blockchain-powered module reviews
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
          Make better course choices with{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            transparent reviews
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          HSLU students helping students. Review modules, earn reputation, and discover the best courses through decentralized, censorship-resistant feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2 font-semibold"
            onClick={() => {
              const moduleSection = document.getElementById('modules-section')
              if (moduleSection) {
                moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          >
            Browse Modules <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 font-semibold"
            onClick={() => setVerificationDialogOpen(true)}
          >
            <Shield className="w-4 h-4" /> Get Verified
          </Button>
        </div>

        <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
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

              {wallet && (
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
              )}

              <Button 
                type="button" 
                className="w-full" 
                onClick={() => setVerificationDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Verified Students</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Only HSLU students with @stud.hslu.ch emails can review. Soul-bound NFT badges ensure authenticity.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">Community Driven</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Upvote helpful reviews, build reputation, and contribute to a better learning experience.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="font-bold text-lg mb-2">Blockchain Secured</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Reviews stored on Polygon. Transparent, immutable, and censorship-resistant forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
