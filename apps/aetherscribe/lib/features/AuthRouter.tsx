'use client'

import { useEffect, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

interface I_AuthRouterProps {
    children: ReactNode
}

// Routes allowed ONLY when NOT authenticated
const AUTH_ROUTES = ['/signup', '/login', '/account-recovery']

const isRouteMatch = (pathname: string, route: string): boolean => {
    if (pathname === route) return true
    if (pathname.startsWith(route + '/')) return true
    return false
}

export default function AuthRouter({ children }: I_AuthRouterProps) {
    const { user, isLoading } = useUser()
    const pathname = usePathname()
    const router = useRouter()

    const [canRender, setCanRender] = useState(false)

    const isAuthRoute = AUTH_ROUTES.some((route) =>
        isRouteMatch(pathname, route)
    )

    useEffect(() => {
        if (isLoading) return

        if (pathname === '/') {
            router.replace(user ? '/dashboard' : '/login')
            return
        }

        // 🚫 Not authenticated → ONLY auth routes allowed
        if (!user && !isAuthRoute) {
            router.replace('/login')
            setCanRender(false)
            return
        }

        // 🚫 Authenticated → auth routes forbidden
        if (user && isAuthRoute) {
            router.replace('/dashboard')
            setCanRender(false)
            return
        }

        // ✅ Allowed route
        setCanRender(true)
    }, [user, isAuthRoute, isLoading, router])

    // While auth is resolving or redirecting, render nothing
    if (isLoading || !canRender) {
        return null
    }

    return <>{children}</>
}
