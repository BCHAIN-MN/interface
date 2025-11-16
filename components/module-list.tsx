'use client'

import { useState } from 'react'
import { ModuleCard } from '@/components/module-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data - in production, this would come from blockchain/backend
const mockModules = [
  {
    id: 1,
    name: 'Penetration Testing & Ethical Hacking',
    department: 'Information and Cybersecurity',
    semester: 3,
    averageRating: 4.5,
    totalReviews: 23,
    workload: 'High',
    difficulty: 'Medium',
    description: 'Learn advanced penetration testing techniques and ethical hacking methodologies.',
  },
  {
    id: 2,
    name: 'Web Application Security',
    department: 'Information and Cybersecurity',
    semester: 2,
    averageRating: 4.2,
    totalReviews: 45,
    workload: 'Medium',
    difficulty: 'Medium',
    description: 'Comprehensive course on web vulnerabilities, OWASP Top 10, and secure coding practices.',
  },
  {
    id: 3,
    name: 'Cryptography Fundamentals',
    department: 'Computer Science',
    semester: 4,
    averageRating: 4.8,
    totalReviews: 31,
    workload: 'High',
    difficulty: 'High',
    description: 'Deep dive into cryptographic algorithms, protocols, and their practical applications.',
  },
  {
    id: 4,
    name: 'Introduction to Web Development',
    department: 'Computer Science',
    semester: 1,
    averageRating: 4.0,
    totalReviews: 67,
    workload: 'Low',
    difficulty: 'Low',
    description: 'Learn HTML, CSS, JavaScript, and modern web development frameworks.',
  },
  {
    id: 5,
    name: 'Network Security & Architecture',
    department: 'Information and Cybersecurity',
    semester: 3,
    averageRating: 4.3,
    totalReviews: 28,
    workload: 'Medium',
    difficulty: 'Medium',
    description: 'Understanding network protocols, security architectures, and defense strategies.',
  },
  {
    id: 6,
    name: 'Malware Analysis & Reverse Engineering',
    department: 'Information and Cybersecurity',
    semester: 4,
    averageRating: 4.7,
    totalReviews: 19,
    workload: 'High',
    difficulty: 'High',
    description: 'Advanced malware analysis techniques, reverse engineering, and incident response.',
  },
]

export function ModuleList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  const filteredModules = mockModules.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || module.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(mockModules.map(m => m.department)))

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Browse Modules</h2>
          <p className="text-muted-foreground">
            Discover courses reviewed by your fellow HSLU students
          </p>

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
            <ModuleCard key={module.id} module={module} />
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
