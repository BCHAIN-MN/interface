"use client"

import { useState, useEffect, useCallback } from "react"
import { ModuleCard } from "@/components/module-card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchModulesFromChain, getModuleReviewsContract } from "@/lib/contracts"
import { useToast } from "@/hooks/use-toast"

interface ModuleListProps {
  isVerified?: boolean
}

export function ModuleList({ isVerified = false }: ModuleListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [modules, setModules] = useState<Array<{
    id: number | string
    name: string
    department?: string
    semester?: number
    averageRating?: number
    totalReviews?: number
    workload?: string
    difficulty?: string
    description?: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadModules = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    const chainModules = await fetchModulesFromChain()
    setModules(chainModules || [])
    if (showLoading) setLoading(false)
  }, [])

  useEffect(() => {
    loadModules(true)
  }, [loadModules])


  useEffect(() => {
    let contract: any = null

    const setupEventListeners = async () => {
      contract = await getModuleReviewsContract(false)

      if (!contract) return

      console.log("🎧 Listening for Blockchain events...")

      contract.on("ModuleAdded", (moduleId: string) => {
        console.log("⚡ Event: ModuleAdded", moduleId)

        toast({
          title: "New Module Detected",
          description: `Module ${moduleId} was just added to the chain.`,
        })

        loadModules(false)
      })

      contract.on("ReviewAdded", (moduleId: string, reviewer: string, rating: number) => {
        console.log("⚡ Event: ReviewAdded", moduleId)

        loadModules(false)
      })
    }

    setupEventListeners()

    return () => {
      if (contract) {
        console.log("🛑 Removing listeners")
        contract.removeAllListeners()
      }
    }
  }, [loadModules, toast])


  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || module.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(modules.map((m) => m.department).filter(Boolean)))

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="modules-section" className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Browse Modules</h2>
          <p className="text-muted-foreground">Discover courses reviewed by your fellow HSLU students</p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} isVerified={isVerified} />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No modules found matching your criteria</p>
          </div>
        )}
      </div>
    </section>
  )
}
