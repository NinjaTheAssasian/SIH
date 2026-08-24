import Link from 'next/link'
import { Briefcase, Building2, GraduationCap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TalentMatch</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Turn job requirements into <br />
          <span className="text-blue-600">career roadmaps</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Match candidates to opportunities, discover skill gaps, and make campus placements dramatically faster with AI-powered intelligence.
        </p>
      </section>

      {/* Three User Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Job Seekers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Looking for a Job
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discover which jobs you're ready for and get personalized learning paths to close your skill gaps.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>See your match score for every job</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Understand exactly what skills you're missing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Get a personalized improvement roadmap</span>
              </li>
            </ul>
            <Link
              href="/register?role=candidate"
              className="block w-full px-6 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Join as Candidate
            </Link>
          </div>

          {/* Recruiters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              I'm Hiring
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Find candidates who genuinely match your requirements with AI-powered candidate intelligence.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI extracts requirements from job descriptions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Candidates ranked by true skill match</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>See evidence-based match explanations</span>
              </li>
            </ul>
            <Link
              href="/register?role=recruiter"
              className="block w-full px-6 py-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Join as Recruiter
            </Link>
          </div>

          {/* Institutes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              I'm an Institute
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Automate placement drives, match students to companies, and understand your students' skill gaps.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Auto-filter eligible students for each drive</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI ranks candidates for placement officers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Understand which skills companies demand</span>
              </li>
            </ul>
            <Link
              href="/register?role=institute"
              className="block w-full px-6 py-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Join as Institute
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            The Placement Intelligence Loop
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, text: 'Company posts job with requirements' },
              { step: 2, text: 'AI extracts structured skill requirements' },
              { step: 3, text: 'Institute creates placement drive' },
              { step: 4, text: 'Platform filters eligible students automatically' },
              { step: 5, text: 'AI ranks students by genuine match' },
              { step: 6, text: 'Placement officer reviews and shortlists' },
              { step: 7, text: 'Company receives vetted shortlist' },
              { step: 8, text: 'Students see their gaps and improve' },
              { step: 9, text: 'Better candidates surface for future roles' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 TalentMatch. AI-Powered Placement Intelligence Platform.</p>
        </div>
      </footer>
    </div>
  )
}
