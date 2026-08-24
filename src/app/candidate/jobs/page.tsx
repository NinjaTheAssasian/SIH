import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Building2, MapPin, DollarSign, Briefcase, ArrowLeft, Search } from 'lucide-react'

export default async function CandidateJobsPage({
  searchParams,
}: {
  searchParams: { search?: string; location?: string }
}) {
  const user = await requireAuth()

  if (user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const profile = await getCandidateProfile(user.id)

  if (!profile) {
    redirect('/')
  }

  // Fetch published jobs
  const jobs = await prisma.job.findMany({
    where: {
      status: 'PUBLISHED',
      ...(searchParams.search
        ? {
            OR: [
              { title: { contains: searchParams.search } },
              { description: { contains: searchParams.search } },
            ],
          }
        : {}),
      ...(searchParams.location
        ? { location: { contains: searchParams.location } }
        : {}),
    },
    include: {
      company: true,
      skills: {
        include: {
          skill: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  })

  // Calculate basic match scores (simplified for Phase 2, will be enhanced in Phase 4)
  const jobsWithMatch = jobs.map((job) => {
    const requiredSkills = job.skills
      .filter((js) => js.requirementType === 'REQUIRED')
      .map((js) => js.skill.name.toLowerCase())

    const candidateSkillNames = profile.skills.map((cs) =>
      cs.skill.name.toLowerCase()
    )

    const matchedSkills = requiredSkills.filter((skill) =>
      candidateSkillNames.includes(skill)
    )

    const matchScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0

    return {
      ...job,
      matchScore,
      matchedSkillsCount: matchedSkills.length,
      totalRequiredSkills: requiredSkills.length,
    }
  })

  // Sort by match score
  jobsWithMatch.sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/candidate/dashboard"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Browse Jobs
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {jobs.length} opportunities available
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <form className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search job titles..."
                defaultValue={searchParams.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                placeholder="Location"
                defaultValue={searchParams.location}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Jobs List */}
        {jobsWithMatch.length > 0 ? (
          <div className="space-y-4">
            {jobsWithMatch.map((job) => (
              <Link
                key={job.id}
                href={`/candidate/jobs/${job.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      {job.matchScore > 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.matchScore >= 80
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : job.matchScore >= 60
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                          }`}
                        >
                          {job.matchScore}% Match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company.name}
                      </div>
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      )}
                      {job.salaryMin && job.salaryMax && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salaryCurrency} {job.salaryMin / 100000}L - {job.salaryMax / 100000}L
                        </div>
                      )}
                      {job.employmentType && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.employmentType}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    {job.matchScore > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        You match {job.matchedSkillsCount} of {job.totalRequiredSkills} required
                        skills
                      </div>
                    )}

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 5).map((jobSkill) => {
                          const hasSkill = profile.skills.some(
                            (cs) => cs.skill.name.toLowerCase() === jobSkill.skill.name.toLowerCase()
                          )
                          return (
                            <span
                              key={jobSkill.id}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                hasSkill
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {jobSkill.skill.name}
                            </span>
                          )
                        })}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
