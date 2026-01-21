'use client'

import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

import { Button } from '@rnb/modularix'

import IconHidden from '../../../assets/eye-outlined-rounded.svg'
import IconShown from '../../../assets/eye-solid-rounded.svg'

interface I_SignUpData {
    profile: {
        firstName: string
        lastNames: string
        dateOfBirth: string
        nationality: string
    }
    contact: {
        email: string
    }
    password: string
    passwordConfirm: string
}

const formDataInit: I_SignUpData = {
    profile: {
        firstName: '',
        lastNames: '',
        dateOfBirth: '',
        nationality: '',
    },
    contact: {
        email: '',
    },
    password: '',
    passwordConfirm: '',
}

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [formData, setFormData] = useState<I_SignUpData>(formDataInit)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(
                'http://localhost:5674/api/v1/user/sign-up',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log('Sign up successful:', response.data)

            // Handle success (e.g., redirect, show success message, etc.)
            // Example: router.push('/dashboard')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || error.message
                setError(errorMessage)
                console.error('Sign up error:', errorMessage)
            } else {
                setError('An unexpected error occurred')
                console.error('Unexpected error:', error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Dynamic handler for profile fields
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setFormData((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [id]: value,
            },
        }))
    }

    // Dynamic handler for contact fields
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setFormData((prev) => ({
            ...prev,
            contact: {
                ...prev.contact,
                [id]: value,
            },
        }))
    }

    // Dynamic handler for top-level fields (password, passwordConfirm)
    const handleTopLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    return (
        <form className="form-container" onSubmit={handleSignUp}>
            {error && (
                <div
                    className="error-message"
                    style={{ color: 'red', marginBottom: '1rem' }}
                >
                    {error}
                </div>
            )}

            <div className="form-input-container">
                <label className="form-label" htmlFor="firstName">
                    First Name
                </label>
                <input
                    className="form-input"
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={formData.profile.firstName}
                    onChange={handleProfileChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
            </div>
            <div className="form-input-container">
                <label className="form-label" htmlFor="lastNames">
                    Last Name(s)
                </label>
                <input
                    className="form-input"
                    type="text"
                    id="lastNames"
                    placeholder="Last Name(s)"
                    value={formData.profile.lastNames}
                    onChange={handleProfileChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
            </div>
            <div className="form-input-container">
                <label className="form-label" htmlFor="dateOfBirth">
                    Date of Birth
                </label>
                <input
                    className="form-input"
                    type="text"
                    id="dateOfBirth"
                    placeholder="01/01/1990"
                    value={formData.profile.dateOfBirth}
                    onChange={handleProfileChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
            </div>
            <div className="form-input-container">
                <label className="form-label" htmlFor="email">
                    Email
                </label>
                <input
                    className="form-input"
                    type="email"
                    id="email"
                    placeholder="youremail@mail.com"
                    value={formData.contact.email}
                    onChange={handleContactChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
            </div>
            <div className="form-input-container password-wrapper">
                <label className="form-label" htmlFor="password">
                    Password
                </label>
                <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="*********"
                    value={formData.password}
                    onChange={handleTopLevelChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
                <Image
                    src={showPassword ? IconShown : IconHidden}
                    alt=""
                    className="password-visibilty"
                    onClick={() => setShowPassword((prev) => !prev)}
                />
            </div>

            <div className="form-input-container password-wrapper">
                <label className="form-label" htmlFor="passwordConfirm">
                    Password Confirm
                </label>
                <input
                    className="form-input"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    id="passwordConfirm"
                    placeholder="*********"
                    value={formData.passwordConfirm}
                    onChange={handleTopLevelChange}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
                <Image
                    src={showPasswordConfirm ? IconShown : IconHidden}
                    alt=""
                    className="password-visibilty"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                />
            </div>

            <Button btnType="submit" isDisabled={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
        </form>
    )
}
