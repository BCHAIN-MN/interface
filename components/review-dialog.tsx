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
import { Star, PenSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReviewDialogProps {
  moduleId: number
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would submit to blockchain
    console.log('Submitting review:', { moduleId, rating, workload, difficulty, reviewText })
    
    toast({
      title: 'Review Submitted! 🎉',
      description: 'Your review has been recorded on the blockchain.',
    })
    
    setOpen(false)
    // Reset form
    setRating(0)
    setWorkload(0)
    setDifficulty(0)
    setReviewText('')
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
              disabled={rating === 0 || workload === 0 || difficulty === 0 || !reviewText.trim()}
              className="flex-1"
            >
              Submit Review to Blockchain
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
