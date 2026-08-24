import { redirect } from 'next/navigation'
import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import { Briefcase, FileText, GraduationCap, Award, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default async function CandidateDashboard() {
  const user = await requireAuth()

  if (user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const profile = await getCandidateProfile(user.id)

  if (!profile) {
    redirect('/')
  }

  const stats = {
    profileCompletion: profile.profileComplete ? 100 : 60,
    applications: 0, // Will be calculated from applications
    savedJobs: 0,
    matchedJobs: 0,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {profile.fullName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.institute?.name || 'Job Seeker'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/candidate/profile"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Profile
              </Link>
              <Link
                href="/candidate/jobs"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.profileCompletion}%
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.applications}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Matched Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.matchedJobs}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {profile.skills.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/candidate/profile?tab=resume"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {profile.resumes.length > 0 ? 'Update Resume' : 'Upload Resume'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.resumes.length > 0
                    ? 'Keep your resume current'
                    : 'Get AI-powered insights'}
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/candidate/profile?tab=skills"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage Skills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add or update your skills
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/candidate/jobs"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Find Jobs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover matching opportunities
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
              <Link
                href="/candidate/profile?tab=education"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {profile.education.length > 0 ? 'Manage' : 'Add'}
              </Link>
            </div>
            {profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="border-l-2 border-blue-600 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    {edu.grade && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">Grade: {edu.grade}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No education added yet</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
              <Link
                href="/candidate/profile?tab=skills"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {profile.skills.length > 0 ? 'Manage' : 'Add'}
              </Link>
            </div>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 10).map((candidateSkill) => (
                  <span
                    key={candidateSkill.id}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                  >
                    {candidateSkill.skill.name}
                  </span>
                ))}
                {profile.skills.length > 10 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-full text-sm">
                    +{profile.skills.length - 10} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No skills added yet</p>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
              <Link
                href="/candidate/profile?tab=projects"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {profile.projects.length > 0 ? 'Manage' : 'Add'}
              </Link>
            </div>
            {profile.projects.length > 0 ? (
              <div className="space-y-4">
                {profile.projects.slice(0, 2).map((project) => (
                  <div key={project.id} className="border-l-2 border-green-600 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No projects added yet</p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
              <Link
                href="/candidate/profile?tab=experience"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {profile.experiences.length > 0 ? 'Manage' : 'Add'}
              </Link>
            </div>
            {profile.experiences.length > 0 ? (
              <div className="space-y-4">
                {profile.experiences.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="border-l-2 border-purple-600 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {exp.employmentType} • {exp.isCurrent ? 'Current' : 'Past'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No experience added yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
