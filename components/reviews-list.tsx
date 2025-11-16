'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, Star, Shield } from 'lucide-react'
import { useState } from 'react'

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    moduleId: 1,
    reviewer: '0x1234...5678',
    rating: 5,
    workload: 4,
    difficulty: 3,
    reviewText: 'Excellent course! The hands-on labs were incredibly valuable. Professor explains complex concepts clearly and the practical exercises really solidify the learning. Highly recommend for anyone serious about cybersecurity.',
    upvotes: 12,
    downvotes: 1,
    timestamp: '2024-01-15',
    reputation: 156,
    isVerified: true,
  },
  {
    id: 2,
    moduleId: 1,
    reviewer: '0xabcd...efgh',
    rating: 4,
    workload: 5,
    difficulty: 4,
    reviewText: 'Great content but be prepared for a heavy workload. Weekly labs take 6-8 hours. The final project is challenging but you learn a ton. Make sure you have solid networking fundamentals before taking this.',
    upvotes: 8,
    downvotes: 0,
    timestamp: '2024-01-10',
    reputation: 89,
    isVerified: true,
  },
  {
    id: 3,
    moduleId: 1,
    reviewer: '0x9876...4321',
    rating: 4,
    workload: 4,
    difficulty: 3,
    reviewText: 'Solid introduction to pentesting. Covers all the essential tools and methodologies. Could use more real-world scenarios but overall very practical and applicable.',
    upvotes: 5,
    downvotes: 1,
    timestamp: '2024-01-05',
    reputation: 45,
    isVerified: false,
  },
]

interface ReviewsListProps {
  moduleId: number
}

export function ReviewsList({ moduleId }: ReviewsListProps) {
  const reviews = mockReviews.filter(r => r.moduleId === moduleId)
  const [votedReviews, setVotedReviews] = useState<Record<number, 'up' | 'down'>>({})

  const handleVote = (reviewId: number, voteType: 'up' | 'down') => {
    setVotedReviews(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === voteType ? undefined : voteType as 'up' | 'down'
    }))
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this module!
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-semibold text-lg">Student Reviews</h3>
      
      {reviews.map((review) => (
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
                        {review.reviewer}
                      </span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                          <Shield className="w-3 h-3" />
                          Verified Student
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Reputation: {review.reputation}
                      </Badge>
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
                      <span>{review.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-pretty">
                  {review.reviewText}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={votedReviews[review.id] === 'up' ? 'default' : 'outline'}
                    className="gap-1 h-8"
                    onClick={() => handleVote(review.id, 'up')}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {review.upvotes + (votedReviews[review.id] === 'up' ? 1 : 0)}
                  </Button>
                  <Button
                    size="sm"
                    variant={votedReviews[review.id] === 'down' ? 'destructive' : 'outline'}
                    className="gap-1 h-8"
                    onClick={() => handleVote(review.id, 'down')}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    {review.downvotes + (votedReviews[review.id] === 'down' ? 1 : 0)}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
