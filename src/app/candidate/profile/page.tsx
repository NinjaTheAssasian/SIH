import { requireAuth, getCandidateProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText, GraduationCap, Briefcase as BriefcaseIcon, Award, ArrowLeft } from 'lucide-react'
import ResumeUpload from '@/components/candidate/ResumeUpload'
import { format } from 'date-fns'

export default async function CandidateProfilePage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const user = await requireAuth()

  if (user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const profile = await getCandidateProfile(user.id)

  if (!profile) {
    redirect('/')
  }

  const activeTab = searchParams.tab || 'resume'

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
                  My Profile
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your professional information
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.fullName}
              </h2>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {profile.institute && <p>{profile.institute.name}</p>}
                {profile.department && <p>{profile.department.name}</p>}
                {profile.degree && profile.graduationYear && (
                  <p>{profile.degree} • Graduating {profile.graduationYear}</p>
                )}
                {profile.cgpa && <p>CGPA: {profile.cgpa}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'resume', label: 'Resume', icon: FileText },
                { id: 'skills', label: 'Skills', icon: Award },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
                { id: 'projects', label: 'Projects', icon: Briefcase },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <Link
                    key={tab.id}
                    href={`/candidate/profile?tab=${tab.id}`}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <ResumeUpload />

                {profile.resumes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Uploaded Resumes
                    </h3>
                    <div className="space-y-3">
                      {profile.resumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {resume.fileName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Uploaded {format(new Date(resume.uploadedAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <a
                            href={resume.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Skills
                  </h3>
                  {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((candidateSkill) => (
                        <span
                          key={candidateSkill.id}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium"
                        >
                          {candidateSkill.skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No skills added yet. Upload your resume to automatically extract skills.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                {profile.education.length > 0 ? (
                  profile.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {edu.fieldOfStudy}
                        </p>
                      )}
                      {edu.grade && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          Grade: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No education added yet. Upload your resume to automatically extract education.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                {profile.experiences.length > 0 ? (
                  profile.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {exp.employmentType} • {exp.isCurrent ? 'Current' : 'Past'}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No experience added yet. Upload your resume to automatically extract experience.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {profile.projects.length > 0 ? (
                  profile.projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.technologies.split(',').map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No projects added yet. Upload your resume to automatically extract projects.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
