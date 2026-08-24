import { Role, ApplicationStatus, JobStatus, PlacementDriveStatus, SkillRequirementType } from '@prisma/client'

export type { Role, ApplicationStatus, JobStatus, PlacementDriveStatus, SkillRequirementType }

export interface MatchResult {
  matchScore: number
  eligibility: {
    isEligible: boolean
    reasons?: string[]
  }
  matchedSkills: string[]
  potentialSkills: string[]
  missingSkills: string[]
  projectRelevance: number
  experienceRelevance: number
  strengths: string[]
  gaps: string[]
  recommendation: 'STRONG' | 'CONSIDER' | 'WEAK'
}

export interface SkillGapAnalysis {
  skillName: string
  priority: number
  impactScore: number
  status: 'NOT_FOUND' | 'POSSIBLE' | 'CONFIRMED'
  evidence?: string
}

export interface LearningPath {
  title: string
  description: string
  skillsTargeted: string[]
  estimatedWeeks: number
  priority: number
}

export interface JobRequirements {
  role: string
  requiredSkills: string[]
  preferredSkills: string[]
  education: string[]
  eligibleDepartments: string[]
  minimumCGPA?: number
  graduationYears: number[]
  experienceMin?: number
  experienceMax?: number
}
