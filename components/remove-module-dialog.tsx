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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Mock existing modules
const existingModules = [
  { id: 1, name: 'Legacy Java Programming', department: 'Computer Science' },
  { id: 7, name: 'Flash Development', department: 'Computer Science' },
  { id: 8, name: 'Windows XP Administration', department: 'Information Technology' },
]

export function RemoveModuleDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedModule, setSelectedModule] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Removal proposal submitted:', { selectedModule, reason })
    alert('Module removal proposal submitted! Other verified students can now vote on it.')
    
    setLoading(false)
    setOpen(false)
    setSelectedModule('')
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
          <Trash2 className="w-4 h-4" />
          Propose Module Removal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Propose Module Removal</DialogTitle>
          <DialogDescription>
            Submit a proposal to remove an outdated or discontinued module. This requires community approval.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Module removal is permanent and will delete all associated reviews. Only propose removal for modules that are no longer taught.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-select">Select Module to Remove</Label>
            <Select
              value={selectedModule}
              onValueChange={setSelectedModule}
              required
            >
              <SelectTrigger id="module-select">
                <SelectValue placeholder="Choose a module" />
              </SelectTrigger>
              <SelectContent>
                {existingModules.map((module) => (
                  <SelectItem key={module.id} value={module.id.toString()}>
                    {module.name} ({module.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="removal-reason">Reason for Removal</Label>
            <Textarea
              id="removal-reason"
              placeholder="Explain why this module should be removed (e.g., no longer in curriculum, outdated content, replaced by another module)..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Provide clear justification to help other students make an informed vote.
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Voting Requirements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Requires 50 votes from verified HSLU students</li>
              <li>• Voting period: 7 days</li>
              <li>• Must maintain 70% approval rate (higher threshold for removal)</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Removal Proposal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
