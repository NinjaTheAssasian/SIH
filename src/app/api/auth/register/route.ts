import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role, fullName, ...rest } = body

    if (!email || !password || !role || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: role as Role,
      },
    })

    if (role === Role.JOB_SEEKER) {
      let instituteId = null
      if (rest.instituteName) {
        let institute = await prisma.institute.findUnique({
          where: { name: rest.instituteName },
        })
        if (!institute) {
          institute = await prisma.institute.create({
            data: { name: rest.instituteName },
          })
        }
        instituteId = institute.id

        if (rest.departmentName) {
          await prisma.department.upsert({
            where: {
              instituteId_name: {
                instituteId: institute.id,
                name: rest.departmentName,
              },
            },
            update: {},
            create: {
              instituteId: institute.id,
              name: rest.departmentName,
            },
          })
        }
      }

      let departmentId = null
      if (instituteId && rest.departmentName) {
        const dept = await prisma.department.findUnique({
          where: {
            instituteId_name: {
              instituteId,
              name: rest.departmentName,
            },
          },
        })
        departmentId = dept?.id || null
      }

      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName,
          studentId: rest.studentId || null,
          degree: rest.degree || null,
          graduationYear: rest.graduationYear ? parseInt(rest.graduationYear) : null,
          cgpa: rest.cgpa ? parseFloat(rest.cgpa) : null,
          instituteId,
          departmentId,
          profileComplete: true,
        },
      })
    } else if (role === Role.RECRUITER) {
      let companyId = null
      if (rest.companyName) {
        let company = await prisma.company.findUnique({
          where: { name: rest.companyName },
        })
        if (!company) {
          company = await prisma.company.create({
            data: {
              name: rest.companyName,
              location: rest.companyLocation || null,
            },
          })
        }
        companyId = company.id
      }

      await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          fullName,
          designation: rest.designation || null,
          companyId,
        },
      })
    } else if (role === Role.INSTITUTE) {
      let instituteId = null
      if (rest.instituteName) {
        let institute = await prisma.institute.findUnique({
          where: { name: rest.instituteName },
        })
        if (!institute) {
          institute = await prisma.institute.create({
            data: { name: rest.instituteName },
          })
        }
        instituteId = institute.id
      }

      await prisma.instituteProfile.create({
        data: {
          userId: user.id,
          fullName,
          designation: rest.designation || 'Placement Officer',
          instituteId,
        },
      })
    }

    return NextResponse.json({
      message: 'User registered successfully',
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
