import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor' | 'ai-service'

export const hasRole = (user: unknown, roles: UserRole[]) => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  return roles.includes((user as { role?: UserRole }).role ?? 'editor')
}

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const admins: Access = ({ req }) => hasRole(req.user, ['admin'])

export const editors: Access = ({ req }) => hasRole(req.user, ['admin', 'editor'])

export const contentContributors: Access = ({ req }) =>
  hasRole(req.user, ['admin', 'editor', 'ai-service'])

export const adminFieldAccess: FieldAccess = ({ req }) => hasRole(req.user, ['admin'])

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
