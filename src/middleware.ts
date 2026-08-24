import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/register']
const candidateRoutes = ['/candidate']
const recruiterRoutes = ['/recruiter']
const instituteRoutes = ['/institute']
const adminRoutes = ['/admin']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isPublicRoute = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith('/api/auth')
  )

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Role-based access control
  const path = nextUrl.pathname

  if (path.startsWith('/candidate') && userRole !== 'JOB_SEEKER') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (path.startsWith('/recruiter') && userRole !== 'RECRUITER') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (path.startsWith('/institute') && userRole !== 'INSTITUTE') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (path.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
}
