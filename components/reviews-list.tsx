'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchReviewsForModule, checkVerificationStatus } from '@/lib/contracts'

interface ReviewsListProps {
  moduleId: number | string
  refreshTrigger?: number
}

interface Review {
  id: number
  moduleId: string
  reviewer: string
  rating: number
  workload: number
  difficulty: number
  comment: string
  timestamp: number
}

export function ReviewsList({ moduleId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [verifiedStatus, setVerifiedStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadReviews() {
      setLoading(true)
      const moduleIdStr = typeof moduleId === 'string' ? moduleId : moduleId.toString()
      const fetchedReviews = await fetchReviewsForModule(moduleIdStr)
      
      if (fetchedReviews) {
        setReviews(fetchedReviews)
        
        // Check verification status for each reviewer
        const statuses: Record<string, boolean> = {}
        for (const review of fetchedReviews) {
          if (!statuses[review.reviewer]) {
            try {
              statuses[review.reviewer] = await checkVerificationStatus(review.reviewer)
            } catch (error) {
              statuses[review.reviewer] = false
            }
          }
        }
        setVerifiedStatus(statuses)
      }
      setLoading(false)
    }

    loadReviews()
  }, [moduleId, refreshTrigger])

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading reviews...
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this module!
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-semibold text-lg">Student Reviews</h3>
      
      {reviews.map((review) => {
        const isVerified = verifiedStatus[review.reviewer] || false
        const shortAddress = `${review.reviewer.slice(0, 6)}...${review.reviewer.slice(-4)}`
        
        return (
          <Card key={review.id} className="bg-muted/30">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {review.reviewer.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium">
                          {shortAddress}
                        </span>
                        {isVerified && (
                          <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                            <Shield className="w-3 h-3" />
                            Verified Student
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-chart-4 text-chart-4" />
                          {review.rating}/5
                        </div>
                        <span>•</span>
                        <span>Workload: {review.workload}/5</span>
                        <span>•</span>
                        <span>Difficulty: {review.difficulty}/5</span>
                        <span>•</span>
                        <span>{formatDate(review.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-pretty">
                    {review.comment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
