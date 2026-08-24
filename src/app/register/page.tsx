'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

type Role = 'JOB_SEEKER' | 'RECRUITER' | 'INSTITUTE'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')

  const [role, setRole] = useState<Role>('JOB_SEEKER')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    instituteName: '',
    departmentName: '',
    studentId: '',
    degree: '',
    graduationYear: '',
    cgpa: '',
    companyName: '',
    companyLocation: '',
    designation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (roleParam === 'candidate') setRole('JOB_SEEKER')
    else if (roleParam === 'recruiter') setRole('RECRUITER')
    else if (roleParam === 'institute') setRole('INSTITUTE')
  }, [roleParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Briefcase className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">TalentMatch</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Join the placement intelligence platform</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'JOB_SEEKER', label: 'Candidate' },
                  { value: 'RECRUITER', label: 'Recruiter' },
                  { value: 'INSTITUTE', label: 'Institute' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value as Role)}
                    className={`py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                      role === option.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {role === 'JOB_SEEKER' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institute Name (Optional)
                    </label>
                    <input
                      id="instituteName"
                      name="instituteName"
                      type="text"
                      value={formData.instituteName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department (Optional)
                    </label>
                    <input
                      id="departmentName"
                      name="departmentName"
                      type="text"
                      value={formData.departmentName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Degree (Optional)
                    </label>
                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="B.Tech, M.Tech, etc."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Graduation Year (Optional)
                    </label>
                    <input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      placeholder="2027"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {role === 'RECRUITER' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Designation (Optional)
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g., HR Manager, Talent Acquisition"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {role === 'INSTITUTE' && (
              <>
                <div>
                  <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institute Name
                  </label>
                  <input
                    id="instituteName"
                    name="instituteName"
                    type="text"
                    value={formData.instituteName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Designation
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g., Placement Officer, TPO"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
