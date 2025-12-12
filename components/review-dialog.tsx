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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, PenSquare, Loader2, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { submitReviewToChain } from '@/lib/contracts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ReviewDialogProps {
  moduleId: number | string
  moduleName: string
  isVerified?: boolean
  onReviewSubmitted?: () => void
}

export function ReviewDialog({ moduleId, moduleName, isVerified = false, onReviewSubmitted }: ReviewDialogProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [workload, setWorkload] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || workload === 0 || difficulty === 0 || !reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const moduleIdStr = typeof moduleId === 'string' ? moduleId : moduleId.toString()
      const receipt = await submitReviewToChain(
        moduleIdStr,
        rating,
        workload,
        difficulty,
        reviewText.trim()
      )
      
      toast({
        title: 'Review Submitted! 🎉',
        description: `Transaction: ${receipt.hash.slice(0, 10)}...`,
      })
      
      setOpen(false)
      // Reset form
      setRating(0)
      setWorkload(0)
      setDifficulty(0)
      setReviewText('')
      
      // Notify parent to refresh data instead of reloading page
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error: any) {
      console.error("[HSLU] Error submitting review:", error)
      let errorMessage = error.message || "Failed to submit review"
      
      if (error.message && (error.message.includes("onlyVerifiedStudent") || error.message.includes("Not verified"))) {
        errorMessage = "You need to be verified as an HSLU student first. Please contact the admin."
      } else if (error.message && error.message.includes("does not exist")) {
        errorMessage = "This module does not exist yet."
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

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number
    onChange: (value: number) => void
    label: string 
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? 'fill-chart-4 text-chart-4'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  const WriteReviewButton = (
    <Button className="gap-2" disabled={!isVerified}>
      <PenSquare className="w-4 h-4" />
      Write Review
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isVerified ? (
              <DialogTrigger asChild>
                {WriteReviewButton}
              </DialogTrigger>
            ) : (
              <div>{WriteReviewButton}</div>
            )}
          </TooltipTrigger>
          {!isVerified && (
            <TooltipContent>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>You need to be verified as an HSLU student to write reviews</span>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review {moduleName}</DialogTitle>
          <DialogDescription>
            Share your experience to help fellow students make informed decisions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <StarRating 
            value={rating} 
            onChange={setRating} 
            label="Overall Rating" 
          />

          <StarRating 
            value={workload} 
            onChange={setWorkload} 
            label="Workload (1 = Light, 5 = Heavy)" 
          />

          <StarRating 
            value={difficulty} 
            onChange={setDifficulty} 
            label="Difficulty (1 = Easy, 5 = Hard)" 
          />

          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about the module: content quality, professor, assignments, exams, practical applications..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={6}
              maxLength={5000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length} / 5000 characters
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="submit" 
              disabled={rating === 0 || workload === 0 || difficulty === 0 || !reviewText.trim() || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review to Blockchain"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your review will be permanently stored on-chain and associated with your wallet address
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
