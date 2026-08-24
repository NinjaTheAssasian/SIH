import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Building2, MapPin, DollarSign, Briefcase, ArrowLeft, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string }
}) {
  const user = await requireAuth()

  if (user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const profile = await getCandidateProfile(user.id)

  if (!profile) {
    redirect('/')
  }

  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    include: {
      company: true,
      skills: {
        include: {
          skill: true,
        },
      },
      applications: {
        where: {
          candidateId: profile.id,
        },
      },
    },
  })

  if (!job || job.status !== 'PUBLISHED') {
    notFound()
  }

  const hasApplied = job.applications.length > 0

  // Calculate match
  const requiredSkills = job.skills
    .filter((js) => js.requirementType === 'REQUIRED')
    .map((js) => ({ ...js.skill, isRequired: true }))

  const preferredSkills = job.skills
    .filter((js) => js.requirementType === 'PREFERRED')
    .map((js) => ({ ...js.skill, isRequired: false }))

  const candidateSkillNames = profile.skills.map((cs) =>
    cs.skill.name.toLowerCase()
  )

  const matchedRequired = requiredSkills.filter((skill) =>
    candidateSkillNames.includes(skill.name.toLowerCase())
  )

  const matchedPreferred = preferredSkills.filter((skill) =>
    candidateSkillNames.includes(skill.name.toLowerCase())
  )

  const missingRequired = requiredSkills.filter(
    (skill) => !candidateSkillNames.includes(skill.name.toLowerCase())
  )

  const matchScore =
    requiredSkills.length > 0
      ? Math.round((matchedRequired.length / requiredSkills.length) * 100)
      : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/candidate/jobs"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.company.name}</p>
            </div>
            {!hasApplied && (
              <form action={`/api/candidate/jobs/${job.id}/apply`} method="POST">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </form>
            )}
            {hasApplied && (
              <div className="px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-medium">
                Applied ✓
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {job.company.name}
                </div>
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                )}
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {job.salaryCurrency} {job.salaryMin / 100000}L - {job.salaryMax / 100000}L
                  </div>
                )}
                {job.employmentType && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {job.employmentType}
                  </div>
                )}
                {job.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Posted {format(new Date(job.publishedAt), 'MMM d, yyyy')}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Job Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            {requiredSkills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Required Skills
                </h2>
                <div className="space-y-2">
                  {requiredSkills.map((skill) => {
                    const hasSkill = candidateSkillNames.includes(skill.name.toLowerCase())
                    return (
                      <div
                        key={skill.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        {hasSkill ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            hasSkill
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {skill.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {preferredSkills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preferred Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {preferredSkills.map((skill) => {
                    const hasSkill = candidateSkillNames.includes(skill.name.toLowerCase())
                    return (
                      <span
                        key={skill.id}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          hasSkill
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {skill.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Match
              </h3>

              <div className="relative pt-1 mb-6">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className={`text-4xl font-bold ${
                        matchScore >= 80
                          ? 'text-green-600'
                          : matchScore >= 60
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${matchScore}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      matchScore >= 80
                        ? 'bg-green-600'
                        : matchScore >= 60
                        ? 'bg-blue-600'
                        : 'bg-orange-600'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Required Skills</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {matchedRequired.length} / {requiredSkills.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Preferred Skills</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {matchedPreferred.length} / {preferredSkills.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Skill Gaps */}
            {missingRequired.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skill Gaps
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  You're missing these required skills:
                </p>
                <div className="space-y-2">
                  {missingRequired.map((skill) => (
                    <div
                      key={skill.id}
                      className="text-sm font-medium text-orange-700 dark:text-orange-400"
                    >
                      • {skill.name}
                    </div>
                  ))}
                </div>
                <Link
                  href="/candidate/profile?tab=skills"
                  className="mt-4 block text-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Update Your Skills
                </Link>
              </div>
            )}

            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {job.company.name}
              </h3>
              {job.company.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {job.company.description}
                </p>
              )}
              <div className="space-y-2 text-sm">
                {job.company.industry && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Industry</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {job.company.industry}
                    </span>
                  </div>
                )}
                {job.company.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Company Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {job.company.size}
                    </span>
                  </div>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 block mt-3"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
