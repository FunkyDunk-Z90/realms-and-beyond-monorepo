'use client'

import { LoginForm } from '@rnb/modularix'
import { useUser } from '@/lib/context/UserContext'

export default function LoginPage() {
    const { login } = useUser()
    const devLoginData = {
        email: 'saul.dw90@gmail.com',
        password: '123456789',
    }

    return (
        <LoginForm
            login={login}
            redirectLink="/dashboard"
            devLoginData={devLoginData}
        />
    )
}
