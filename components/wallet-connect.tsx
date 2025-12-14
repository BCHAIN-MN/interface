"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, User, Shield, ChevronDown } from "lucide-react"
import { VerificationDialog } from "@/components/verification-dialog"
import { Badge } from "@/components/ui/badge"
import { checkVerificationStatus } from "@/lib/contracts"

interface WalletConnectProps {
  onWalletChange?: (wallet: string | null, isVerified: boolean) => void
}

export function WalletConnect({ onWalletChange }: WalletConnectProps = {}) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [reputation, setReputation] = useState(0)

  useEffect(() => {
    async function checkVerification() {
      if (!wallet) return

      console.log("[HSLU] Checking verification status...")

      const chainVerified = await checkVerificationStatus(wallet)

      if (chainVerified) {
        console.log("[HSLU] Wallet verified (on-chain)")
        setIsVerified(true)
        onWalletChange?.(wallet, true)
      } else {
        setIsVerified(false)
        onWalletChange?.(wallet, false)
      }
    }

    checkVerification()
  }, [wallet, onWalletChange])

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this feature")
      return
    }

    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      setWallet(accounts[0])
      setReputation(42)
      onWalletChange?.(accounts[0], isVerified)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setIsVerified(false)
    setReputation(0)
    onWalletChange?.(null, false)
  }

  const handleVerified = () => {
    setIsVerified(true)
    onWalletChange?.(wallet, true)
  }

  if (!wallet) {
    return (
      <Button onClick={connectWallet} size="lg" className="gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Wallet className="w-4 h-4" />
          <span className="font-mono">
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </span>
          {isVerified && (
            <Badge variant="secondary" className="ml-1 gap-1 bg-primary/10 text-primary border-primary/20">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {wallet.slice(0, 10)}...{wallet.slice(-8)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reputation:</span>
            <Badge variant="outline">{reputation}</Badge>
          </div>
          {isVerified && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">HSLU Student Verified</span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {!isVerified && (
          <>
            <DropdownMenuItem asChild>
              <VerificationDialog wallet={wallet} onVerified={handleVerified} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
