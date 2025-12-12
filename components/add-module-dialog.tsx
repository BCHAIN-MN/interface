"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addModuleToChain } from "@/lib/contracts"

interface AddModuleDialogProps {
  onModuleAdded?: () => void
}

export function AddModuleDialog({ onModuleAdded }: AddModuleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [moduleId, setModuleId] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!moduleId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a module ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const receipt = await addModuleToChain(moduleId.trim())
      toast({
        title: "Module Added!",
        description: `Transaction: ${receipt.hash.slice(0, 10)}...`,
      })
      setModuleId("")
      setOpen(false)
      onModuleAdded?.()
    } catch (error: any) {
      console.error("[HSLU] Error adding module:", error)
      let errorMessage = error.message || "Failed to add module"
      
      if (error.message && error.message.includes("already exists")) {
        errorMessage = "This module already exists!"
      } else if (error.message && (error.message.includes("onlyVerifiedStudent") || error.message.includes("Not verified"))) {
        errorMessage = "You need to be verified as an HSLU student first. Please contact the admin."
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>
            Add a new module to the platform. You must be verified as an HSLU student.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-id">Module ID</Label>
            <Input
              id="module-id"
              placeholder="e.g., I.BSCINF.2024.7"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the module identifier (e.g., I.BSCINF.2024.7)
            </p>
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
            <Button type="submit" disabled={loading || !moduleId.trim()}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Module
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

