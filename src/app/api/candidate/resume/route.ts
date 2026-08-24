import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import prisma from '@/lib/prisma'
import { extractTextFromPDF, extractTextFromPlainText } from '@/lib/resume/extractor'
import { parseResumeText } from '@/lib/resume/parser'

export async function POST(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await getCandidateProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and TXT files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text from file
    let extractedText: string
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(buffer)
    } else {
      extractedText = extractTextFromPlainText(buffer)
    }

    // Save file to disk
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes')
    await mkdir(uploadsDir, { recursive: true })

    const fileName = `${profile.id}_${Date.now()}_${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/resumes/${fileName}`

    // Parse resume using AI
    const parsedData = await parseResumeText(extractedText)

    // Save resume to database
    const resume = await prisma.resume.create({
      data: {
        candidateId: profile.id,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        extractedText,
        isProcessed: true,
        isPrimary: profile.resumes.length === 0, // First resume is primary
      },
    })

    // Auto-add extracted skills
    const skillsToAdd = parsedData.skills.slice(0, 20) // Limit to first 20
    for (const skillName of skillsToAdd) {
      // Find or create skill
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
      })

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: 'General', // Default category
          },
        })
      }

      // Add to candidate's skills if not already present
      await prisma.candidateSkill.upsert({
        where: {
          candidateId_skillId: {
            candidateId: profile.id,
            skillId: skill.id,
          },
        },
        create: {
          candidateId: profile.id,
          skillId: skill.id,
          source: 'resume',
        },
        update: {},
      })
    }

    // Auto-add education
    for (const edu of parsedData.education) {
      await prisma.education.create({
        data: {
          candidateId: profile.id,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate ? new Date(edu.startDate) : undefined,
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          grade: edu.grade,
        },
      })
    }

    // Auto-add projects
    for (const project of parsedData.projects) {
      await prisma.project.create({
        data: {
          candidateId: profile.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies || '',
        },
      })
    }

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
      },
      parsed: {
        skillsAdded: skillsToAdd.length,
        educationAdded: parsedData.education.length,
        projectsAdded: parsedData.projects.length,
      },
    })
  } catch (error: any) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload resume' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await getCandidateProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const resumes = await prisma.resume.findMany({
      where: { candidateId: profile.id },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json({ resumes })
  } catch (error: any) {
    console.error('Resume fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}
