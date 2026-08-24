// Simple AI-powered resume parser
// In production, this would use Claude API or similar LLM

export interface ParsedResume {
  name?: string
  email?: string
  phone?: string
  skills: string[]
  education: Array<{
    institution: string
    degree: string
    fieldOfStudy?: string
    startDate?: string
    endDate?: string
    grade?: string
  }>
  experience: Array<{
    company: string
    title: string
    startDate?: string
    endDate?: string
    isCurrent: boolean
    description?: string
  }>
  projects: Array<{
    title: string
    description: string
    technologies?: string
  }>
  certifications: Array<{
    name: string
    issuingOrg: string
    issueDate?: string
  }>
}

export async function parseResumeText(text: string): Promise<ParsedResume> {
  // This is a simplified parser for MVP
  // In production, replace with Claude API call for better extraction

  const skills = extractSkills(text)
  const education = extractEducation(text)
  const experience = extractExperience(text)
  const projects = extractProjects(text)
  const certifications = extractCertifications(text)

  return {
    skills,
    education,
    experience,
    projects,
    certifications,
  }
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Sass', 'REST', 'GraphQL', 'API',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Agile', 'Scrum', 'CI/CD', 'DevOps', 'Linux', 'Unix', 'Bash',
    'Data Structures', 'Algorithms', 'OOP', 'Design Patterns', 'Microservices',
    'Testing', 'Jest', 'Pytest', 'Selenium', 'JUnit',
  ]

  const found: string[] = []
  const lowerText = text.toLowerCase()

  for (const skill of commonSkills) {
    const lowerSkill = skill.toLowerCase()
    const regex = new RegExp(`\\b${lowerSkill}\\b`, 'i')
    if (regex.test(lowerText)) {
      found.push(skill)
    }
  }

  return [...new Set(found)]
}

function extractEducation(text: string): ParsedResume['education'] {
  const education: ParsedResume['education'] = []

  // Look for common degree patterns
  const degreePatterns = [
    /(?:B\.?Tech|Bachelor of Technology|B\.?E\.?|Bachelor of Engineering)[\s\S]{0,200}?(\d{4})/gi,
    /(?:M\.?Tech|Master of Technology|M\.?E\.?|Master of Engineering)[\s\S]{0,200}?(\d{4})/gi,
    /(?:B\.?S\.?|Bachelor of Science|B\.?Sc\.?)[\s\S]{0,200}?(\d{4})/gi,
    /(?:M\.?S\.?|Master of Science|M\.?Sc\.?)[\s\S]{0,200}?(\d{4})/gi,
  ]

  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    for (const pattern of degreePatterns) {
      const match = line.match(pattern)
      if (match) {
        const institution = findNearbyInstitution(lines, i)
        education.push({
          degree: match[0].split(/\d{4}/)[0].trim(),
          institution: institution || 'Unknown',
          endDate: match[1] ? `${match[1]}-01-01` : undefined,
        })
      }
    }
  }

  return education
}

function findNearbyInstitution(lines: string[], index: number): string | null {
  // Look in nearby lines for institution names
  const range = 3
  for (let i = Math.max(0, index - range); i <= Math.min(lines.length - 1, index + range); i++) {
    const line = lines[i]
    if (/(?:University|Institute|College|IIT|NIT)/i.test(line)) {
      return line.trim()
    }
  }
  return null
}

function extractExperience(text: string): ParsedResume['experience'] {
  const experience: ParsedResume['experience'] = []

  // Simple pattern matching for experience
  // In production, use LLM for better extraction
  const lines = text.split('\n')
  let currentExp: any = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Look for job titles (lines with common title keywords)
    if (/(?:Software|Developer|Engineer|Intern|Analyst|Manager|Lead)/i.test(line) && line.length < 80) {
      if (currentExp) {
        experience.push(currentExp)
      }

      currentExp = {
        title: line,
        company: lines[i + 1]?.trim() || 'Unknown',
        isCurrent: /present|current/i.test(text.slice(i * 50, (i + 5) * 50)),
      }
    }
  }

  if (currentExp) {
    experience.push(currentExp)
  }

  return experience
}

function extractProjects(text: string): ParsedResume['projects'] {
  const projects: ParsedResume['projects'] = []

  // Look for project sections
  const projectSectionRegex = /(?:projects?|personal projects?|academic projects?)[\s\S]{0,1000}/gi
  const matches = text.match(projectSectionRegex)

  if (matches) {
    const lines = matches[0].split('\n')
    let currentProject: any = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && trimmed.length > 10 && trimmed.length < 100 && !trimmed.startsWith('-')) {
        if (currentProject) {
          projects.push(currentProject)
        }
        currentProject = {
          title: trimmed,
          description: '',
        }
      } else if (currentProject && trimmed) {
        currentProject.description += (currentProject.description ? ' ' : '') + trimmed
      }
    }

    if (currentProject) {
      projects.push(currentProject)
    }
  }

  return projects
}

function extractCertifications(text: string): ParsedResume['certifications'] {
  const certifications: ParsedResume['certifications'] = []

  // Look for common certification keywords
  const certPatterns = [
    /(?:AWS Certified|Azure Certified|Google Cloud|GCP)/gi,
    /(?:Certified|Certification)[\s\S]{0,100}/gi,
  ]

  for (const pattern of certPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        certifications.push({
          name: match.trim(),
          issuingOrg: 'Unknown',
        })
      }
    }
  }

  return certifications
}
