import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return session.user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function getCandidateProfile(userId: string) {
  return await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      institute: true,
      department: true,
      resumes: {
        orderBy: { uploadedAt: 'desc' },
      },
      skills: {
        include: {
          skill: true,
        },
      },
      education: {
        orderBy: { startDate: 'desc' },
      },
      experiences: {
        orderBy: { startDate: 'desc' },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
      },
      certifications: {
        orderBy: { issueDate: 'desc' },
      },
    },
  })
}

export async function getRecruiterProfile(userId: string) {
  return await prisma.recruiterProfile.findUnique({
    where: { userId },
    include: {
      company: true,
      jobs: {
        include: {
          company: true,
          applications: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function getInstituteProfile(userId: string) {
  return await prisma.instituteProfile.findUnique({
    where: { userId },
    include: {
      institute: {
        include: {
          departments: true,
          students: true,
        },
      },
      placementDrives: {
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}
