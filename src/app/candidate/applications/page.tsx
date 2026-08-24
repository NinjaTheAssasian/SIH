import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Building2, Clock, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default async function CandidateApplicationsPage() {
  const user = await requireAuth()

  if (user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const profile = await getCandidateProfile(user.id)

  if (!profile) {
    redirect('/')
  }

  const applications = await prisma.application.findMany({
    where: {
      candidateId: profile.id,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      appliedAt: 'desc',
    },
  })

  const statusConfig = {
    APPLIED: { label: 'Applied', color: 'blue', icon: Clock },
    UNDER_REVIEW: { label: 'Under Review', color: 'yellow', icon: Eye },
    SHORTLISTED: { label: 'Shortlisted', color: 'green', icon: CheckCircle },
    INTERVIEW: { label: 'Interview', color: 'purple', icon: CheckCircle },
    SELECTED: { label: 'Selected', color: 'green', icon: CheckCircle },
    REJECTED: { label: 'Rejected', color: 'red', icon: XCircle },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/candidate/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Applications
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {applications.length} application{applications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => {
              const config = statusConfig[application.status]
              const StatusIcon = config.icon

              return (
                <div
                  key={application.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {application.job.title}
                        </h3>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 dark:bg-${config.color}-900/20 text-${config.color}-700 dark:text-${config.color}-400`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <Building2 className="h-4 w-4" />
                        {application.job.company.name}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Applied on {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                      </div>
                    </div>

                    <Link
                      href={`/candidate/jobs/${application.job.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring jobs and apply to opportunities that match your skills
            </p>
            <Link
              href="/candidate/jobs"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
