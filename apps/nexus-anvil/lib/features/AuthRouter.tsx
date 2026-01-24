'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { useRnBAccount } from '../context/NexusAnvilContext'

interface AuthRouterProps {
    children: ReactNode
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/signup', '/login', '/account-recovery', '/landing']

// Routes that authenticated users shouldn't access
const AUTH_ONLY_ROUTES = ['/signup', '/login', '/account-recovery']

// Routes that don't require RnB account (only authentication)
const NO_RNB_REQUIRED_ROUTES = [
    '/dashboard',
    '/create-rnb-account',
    ...PUBLIC_ROUTES,
]

// Helper function to check if pathname matches a route
const isRouteMatch = (pathname: string, route: string): boolean => {
    if (pathname === route) return true
    if (pathname.startsWith(route + '/')) return true
    return false
}

export default function AuthRouter({ children }: AuthRouterProps) {
    const { isAuthenticated, isLoading: userLoading } = useUser()
    const { hasRnBAccount, isLoading: rnbLoading } = useRnBAccount()
    const pathname = usePathname()
    const router = useRouter()

    const isLoading = userLoading || rnbLoading

    // Determine if we need to redirect
    const shouldRedirect =
        !isLoading &&
        (() => {
            const isRootPath = pathname === '/'
            const isPublicRoute =
                isRootPath ||
                PUBLIC_ROUTES.some((route) => isRouteMatch(pathname, route))
            const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) =>
                isRouteMatch(pathname, route)
            )
            const isNoRnBRequiredRoute = NO_RNB_REQUIRED_ROUTES.some((route) =>
                isRouteMatch(pathname, route)
            )

            if (isRootPath) return true
            if (isAuthenticated && isAuthOnlyRoute) return true
            if (!isAuthenticated && !isPublicRoute) return true
            // If authenticated but no RnB account and trying to access protected routes
            if (isAuthenticated && !hasRnBAccount && !isNoRnBRequiredRoute)
                return true

            return false
        })()

    useEffect(() => {
        if (isLoading) return

        const isRootPath = pathname === '/'
        const isPublicRoute =
            isRootPath ||
            PUBLIC_ROUTES.some((route) => isRouteMatch(pathname, route))
        const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) =>
            isRouteMatch(pathname, route)
        )
        const isNoRnBRequiredRoute = NO_RNB_REQUIRED_ROUTES.some((route) =>
            isRouteMatch(pathname, route)
        )

        // Root path redirect
        if (isRootPath) {
            if (!isAuthenticated) {
                router.replace('/login')
            } else if (!hasRnBAccount) {
                router.replace('/landing')
            } else {
                router.replace('/dashboard')
            }
            return
        }

        // Authenticated users shouldn't access auth-only routes
        if (isAuthenticated && isAuthOnlyRoute) {
            router.replace('/dashboard')
            return
        }

        // Unauthenticated users can only access public routes
        if (!isAuthenticated && !isPublicRoute) {
            router.replace('/login')
            return
        }

        // Authenticated users without RnB account trying to access protected routes
        if (isAuthenticated && !hasRnBAccount && !isNoRnBRequiredRoute) {
            router.replace('/dashboard')
            return
        }
    }, [isAuthenticated, hasRnBAccount, isLoading, pathname, router])

    // Show nothing while checking auth or redirecting
    if (isLoading || shouldRedirect) {
        return null
    }

    return <>{children}</>
}
