'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Vote, Plus, Trash2, Clock, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react'
import { ProposeModuleDialog } from '@/components/propose-module-dialog'
import { RemoveModuleDialog } from '@/components/remove-module-dialog'

// Mock proposal data
const mockProposals = [
  {
    id: 1,
    type: 'add' as const,
    title: 'Add "Blockchain Security" Module',
    description: 'New module covering smart contract auditing, DeFi security, and blockchain forensics.',
    proposer: '0x1234...5678',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-01-22'),
    votesFor: 45,
    votesAgainst: 8,
    totalVoters: 53,
    requiredVotes: 50,
    status: 'active' as const,
    moduleData: {
      name: 'Blockchain Security',
      department: 'Information and Cybersecurity',
      semester: 4,
      description: 'Advanced course on blockchain security, covering smart contract vulnerabilities, DeFi exploits, and security auditing techniques.'
    }
  },
  {
    id: 2,
    type: 'remove' as const,
    title: 'Remove "Legacy Java Programming"',
    description: 'Module is outdated and no longer taught in the curriculum.',
    proposer: '0xabcd...ef01',
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-01-17'),
    votesFor: 67,
    votesAgainst: 12,
    totalVoters: 79,
    requiredVotes: 50,
    status: 'active' as const,
    moduleData: {
      name: 'Legacy Java Programming',
      department: 'Computer Science',
      semester: 2
    }
  },
  {
    id: 3,
    type: 'add' as const,
    title: 'Add "AI Safety & Ethics"',
    description: 'Critical module on AI alignment, safety protocols, and ethical considerations.',
    proposer: '0x9876...4321',
    createdAt: new Date('2024-01-05'),
    expiresAt: new Date('2024-01-12'),
    votesFor: 82,
    votesAgainst: 15,
    totalVoters: 97,
    requiredVotes: 50,
    status: 'passed' as const,
    moduleData: {
      name: 'AI Safety & Ethics',
      department: 'Computer Science',
      semester: 3,
      description: 'Explore AI safety challenges, alignment problems, and ethical frameworks for responsible AI development.'
    }
  }
]

interface ModuleGovernanceProps {
  isVerified: boolean
  wallet: string | null
}

export function ModuleGovernance({ isVerified, wallet }: ModuleGovernanceProps) {
  const [proposals, setProposals] = useState(mockProposals)
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set())

  const handleVote = (proposalId: number, voteFor: boolean) => {
    if (!wallet || !isVerified) {
      alert('Please connect your wallet and verify as HSLU student to vote')
      return
    }

    setProposals(proposals.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: voteFor ? p.votesFor + 1 : p.votesFor,
          votesAgainst: !voteFor ? p.votesAgainst + 1 : p.votesAgainst,
          totalVoters: p.totalVoters + 1
        }
      }
      return p
    }))

    setVotedProposals(new Set([...votedProposals, proposalId]))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" /> Active</Badge>
      case 'passed':
        return <Badge className="gap-1 bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="w-3 h-3" /> Passed</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>
      default:
        return null
    }
  }

  const getVotePercentage = (votesFor: number, totalVoters: number) => {
    if (totalVoters === 0) return 0
    return Math.round((votesFor / totalVoters) * 100)
  }

  const getDaysRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Vote className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Module Governance</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Verified HSLU students can propose adding new modules or removing outdated ones. 
              Each proposal requires {mockProposals[0]?.requiredVotes || 50} votes to pass.
            </p>
          </div>
          
          {isVerified && wallet && (
            <div className="flex gap-3">
              <ProposeModuleDialog />
              <RemoveModuleDialog />
            </div>
          )}
        </div>

        {!isVerified && (
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Verification Required</p>
                <p className="text-sm text-muted-foreground">
                  To propose or vote on modules, please verify your HSLU student status through your wallet menu.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {proposals.map((proposal) => {
            const votePercentage = getVotePercentage(proposal.votesFor, proposal.totalVoters)
            const hasVoted = votedProposals.has(proposal.id)
            const daysRemaining = getDaysRemaining(proposal.expiresAt)
            const isActive = proposal.status === 'active'

            return (
              <Card key={proposal.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg shrink-0 ${
                      proposal.type === 'add' 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      {proposal.type === 'add' ? (
                        <Plus className="w-5 h-5" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{proposal.title}</h3>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Proposed by {proposal.proposer}</span>
                        <span>•</span>
                        <span>{proposal.createdAt.toLocaleDateString()}</span>
                        {isActive && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">
                              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {proposal.totalVoters} / {proposal.requiredVotes} votes
                    </span>
                    <span className="font-medium text-primary">
                      {votePercentage}% approval
                    </span>
                  </div>
                  <Progress value={votePercentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">
                      {proposal.votesFor} For
                    </span>
                    <span className="text-red-600">
                      {proposal.votesAgainst} Against
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-green-500/20 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30"
                      disabled={hasVoted || !isVerified || !wallet}
                      onClick={() => handleVote(proposal.id, true)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Vote For
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                      disabled={hasVoted || !isVerified || !wallet}
                      onClick={() => handleVote(proposal.id, false)}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Vote Against
                    </Button>
                  </div>
                )}

                {hasVoted && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    You voted on this proposal
                  </Badge>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
