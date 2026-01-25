'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/Button'

interface I_LoginProps {
    redirectLink: string
    login: (email: string, password: string) => Promise<void>
    devLoginData: {
        email: string
        password: string
    }
}

export const LoginForm = ({
    redirectLink,
    login,
    devLoginData,
}: I_LoginProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await login(devLoginData.email, devLoginData.password)
            router.push(`${redirectLink}`)
        } catch (err) {
            console.error('Login failed:', err)
        }
    }

    return (
        <div className="form-wrapper">
            <form
                className="form-contents"
                onSubmit={handleSubmit}
                suppressHydrationWarning
            >
                <h1 className="form-title">Login</h1>
                <input
                    className="form-input"
                    type="email"
                    value={devLoginData.email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="off"
                    autoCorrect="off"
                    required
                />
                <input
                    className="form-input"
                    type="password"
                    value={devLoginData.password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*********"
                    autoComplete="off"
                    autoCorrect="off"
                    required
                />
                <Button btnType="submit" children={'Login'} />
                <div className="form-link-wrapper">
                    <p>Don't have a Realms & Beyond account?</p>
                    <Link className="form-link" href={'/signup'}>
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    )
}
