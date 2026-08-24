import { NextResponse } from 'next/server'
import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import prisma from '@/lib/prisma'

export async function POST(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params
    const user = await requireAuth()

    if (user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await getCandidateProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: job.id,
          candidateId: profile.id,
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        candidateId: profile.id,
        status: 'APPLIED',
        appliedVia: 'direct',
      },
    })

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: application.id,
    })
  } catch (error: any) {
    console.error('Application error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}
