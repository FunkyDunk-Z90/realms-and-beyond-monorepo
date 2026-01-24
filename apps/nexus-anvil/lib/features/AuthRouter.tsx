'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

interface AuthRouterProps {
    children: ReactNode
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/signup', '/login', '/account-recovery', '/landing']

// Routes that authenticated users shouldn't access
const AUTH_ONLY_ROUTES = ['/signup', '/login', '/account-recovery']

// Helper function to check if pathname matches a route
const isRouteMatch = (pathname: string, route: string): boolean => {
    if (pathname === route) return true
    if (pathname.startsWith(route + '/')) return true
    return false
}

export default function AuthRouter({ children }: AuthRouterProps) {
    const { isAuthenticated, isLoading } = useUser()
    const pathname = usePathname()
    const router = useRouter()

    // Determine if we need to redirect (without actually redirecting in the check)
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

            if (isRootPath) return true
            if (isAuthenticated && isAuthOnlyRoute) return true
            if (!isAuthenticated && !isPublicRoute) return true

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

        if (isRootPath) {
            router.replace(isAuthenticated ? '/dashboard' : '/landing')
            return
        }

        if (isAuthenticated && isAuthOnlyRoute) {
            router.replace('/dashboard')
            return
        }

        if (!isAuthenticated && !isPublicRoute) {
            router.replace('/login')
            return
        }
    }, [isAuthenticated, isLoading, pathname, router])

    // Show nothing while checking auth or redirecting
    // This allows Next.js loading.tsx to handle the UI
    if (isLoading || shouldRedirect) {
        return null
    }

    return <>{children}</>
}
