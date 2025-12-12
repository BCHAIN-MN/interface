'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, TrendingUp, Activity } from 'lucide-react'
import { useState } from 'react'
import { ReviewDialog } from '@/components/review-dialog'
import { ReviewsList } from '@/components/reviews-list'

interface ModuleCardProps {
  module: {
    id: number
    name: string
    department: string
    semester: number
    averageRating: number
    totalReviews: number
    workload: string
    difficulty: string
    description: string
  }
  isVerified?: boolean
}

export function ModuleCard({ module, isVerified = false }: ModuleCardProps) {
  const [showReviews, setShowReviews] = useState(false)
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0)

  const workloadColor = {
    Low: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    Medium: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    High: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  }

  const difficultyColor = {
    Low: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    Medium: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    High: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-mono text-xs">
                {module.department}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Semester {module.semester}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-balance">{module.name}</CardTitle>
            <CardDescription className="text-pretty">{module.description}</CardDescription>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-2xl font-bold">
              <Star className="w-6 h-6 fill-chart-4 text-chart-4" />
              {module.averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              {module.totalReviews} reviews
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {(module.workload || module.difficulty) && (
          <div className="flex items-center gap-3 flex-wrap">
            {module.workload && (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Workload:</span>
                <Badge variant="outline" className={workloadColor[module.workload as keyof typeof workloadColor]}>
                  {module.workload}
                </Badge>
              </div>
            )}

            {module.difficulty && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Difficulty:</span>
                <Badge variant="outline" className={difficultyColor[module.difficulty as keyof typeof difficultyColor]}>
                  {module.difficulty}
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowReviews(!showReviews)}
            variant="outline" 
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {showReviews ? 'Hide' : 'Read'} Reviews
          </Button>
          <ReviewDialog 
            moduleId={typeof module.id === 'string' ? module.id : module.id.toString()} 
            moduleName={module.name}
            isVerified={isVerified}
            onReviewSubmitted={() => {
              // Trigger refresh of reviews list
              setReviewsRefreshTrigger(prev => prev + 1)
            }}
          />
        </div>

        {showReviews && <ReviewsList moduleId={module.id} />}
      </CardContent>
    </Card>
  )
}
