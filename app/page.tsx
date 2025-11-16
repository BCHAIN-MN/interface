'use client'

import {useState} from 'react'
import {ModuleList} from '@/components/module-list'
import {WalletConnect} from '@/components/wallet-connect'
import {Hero} from '@/components/hero'
import {Stats} from '@/components/stats'
import {ModuleGovernance} from '@/components/module-governance'

export default function Home() {
    const [wallet, setWallet] = useState<string | null>(null)
    const [isVerified, setIsVerified] = useState(false)

    const handleWalletChange = (newWallet: string | null, verified: boolean) => {
        setWallet(newWallet)
        setIsVerified(verified)
    }

    return (
        <main className="min-h-screen">
            <div
                className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">H</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-balance">HSLU Module Reviews</h1>
                            <p className="text-xs text-muted-foreground">Decentralized & Transparent</p>
                        </div>
                    </div>
                    <WalletConnect onWalletChange={handleWalletChange}/>
                </div>
            </div>

            <Hero/>
            <Stats/>
            <ModuleGovernance isVerified={isVerified} wallet={wallet}/>
            <ModuleList/>
        </main>
    )
}
