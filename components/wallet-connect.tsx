"use client"

import { useState, useEffect, useCallback } from "react"
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

const WALLET_STORAGE_KEY = "HSLU_WALLET_ADDRESS"
const WALLET_DISCONNECTED_KEY = "HSLU_WALLET_DISCONNECTED"

export function WalletConnect({ onWalletChange }: WalletConnectProps = {}) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [reputation, setReputation] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)

  // Helper: Clear wallet state and mark as disconnected
  const clearWalletState = useCallback(() => {
    setWallet(null)
    setIsVerified(false)
    setReputation(0)
    localStorage.setItem(WALLET_DISCONNECTED_KEY, "true")
    localStorage.removeItem(WALLET_STORAGE_KEY)
    onWalletChange?.(null, false)
  }, [onWalletChange])

  // Helper: Set wallet and save to localStorage
  const setWalletAndSave = useCallback((account: string) => {
    setWallet(account)
    localStorage.setItem(WALLET_STORAGE_KEY, account)
    localStorage.removeItem(WALLET_DISCONNECTED_KEY)
  }, [])

  // Auto-reconnect wallet on mount if user didn't disconnect
  useEffect(() => {
    const wasDisconnected = localStorage.getItem(WALLET_DISCONNECTED_KEY) === "true"
    const storedWallet = localStorage.getItem(WALLET_STORAGE_KEY)
    
    if (wasDisconnected) {
      localStorage.removeItem(WALLET_STORAGE_KEY)
      return
    }

    if (storedWallet && typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0 && accounts[0].toLowerCase() === storedWallet.toLowerCase()) {
            setWallet(accounts[0])
          } else {
            localStorage.removeItem(WALLET_STORAGE_KEY)
          }
        })
        .catch(() => {
          localStorage.removeItem(WALLET_STORAGE_KEY)
        })
    }
  }, [])

  // Listen for wallet account and chain changes
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        clearWalletState()
      } else if (accounts[0].toLowerCase() !== wallet?.toLowerCase()) {
        setWalletAndSave(accounts[0])
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [wallet, clearWalletState, setWalletAndSave])

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

  // Try to revoke permissions if user was disconnected (ensures popup on reconnect)
  const tryRevokePermissions = useCallback(async () => {
    try {
      const cachedAccounts = await window.ethereum.request({ method: "eth_accounts" })
      if (cachedAccounts.length > 0) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        })
      }
    } catch {
      // wallet_revokePermissions might not be supported - that's okay
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this feature")
      return
    }

    setIsConnecting(true)
    try {
      const wasDisconnected = localStorage.getItem(WALLET_DISCONNECTED_KEY) === "true"
      
      // Try to revoke permissions if user was disconnected (ensures popup on reconnect)
      if (wasDisconnected) {
        await tryRevokePermissions()
      }
      
      // Request account access (shows MetaMask popup)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      
      if (accounts.length > 0) {
        setWalletAndSave(accounts[0])
        setReputation(42)
        onWalletChange?.(accounts[0], isVerified)
      }
    } catch (error: any) {
      console.error("[HSLU] Failed to connect wallet:", error)
      if (error.code === 4001) {
        console.log("[HSLU] User rejected wallet connection")
      }
    } finally {
      setIsConnecting(false)
    }
  }, [isVerified, onWalletChange, tryRevokePermissions, setWalletAndSave])

  const disconnectWallet = useCallback(() => {
    clearWalletState()
  }, [clearWalletState])

  const handleVerified = () => {
    setIsVerified(true)
    onWalletChange?.(wallet, true)
  }

  if (!wallet) {
    return (
      <Button onClick={connectWallet} size="lg" className="gap-2" disabled={isConnecting}>
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
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
