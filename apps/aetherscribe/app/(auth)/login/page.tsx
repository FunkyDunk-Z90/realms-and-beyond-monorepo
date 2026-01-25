'use client'

import { LoginForm } from '@rnb/modularix'
import { useUser } from '@/lib/context/UserContext'

export default function LoginPage() {
    const { login } = useUser()

    return <LoginForm login={login} redirectLink="/dashboard" />
}
