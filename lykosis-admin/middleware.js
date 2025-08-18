export { default } from 'next-auth/middleware'

export const adminOpts = { matcher: ['/admin/:path*'] }