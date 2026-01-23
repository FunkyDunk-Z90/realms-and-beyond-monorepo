'use client'

import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

import EyeClosed from '../../assets/icons/eyeClosed.svg'
import EyeOpen from '../../assets/icons/eyeOpen.svg'

import { Button } from '../Button'

import { I_SignUpDataProps } from '@rnb/types'

interface I_SignUpComponentProps {
    signupApiUrl: string
}

const formDataInit: I_SignUpDataProps = {
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

export const SignUpForm = ({ signupApiUrl }: I_SignUpComponentProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [formData, setFormData] = useState<I_SignUpDataProps>(formDataInit)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [passwordErrors, setPasswordErrors] = useState<string[]>([])
    const [passwordConfirmError, setPasswordConfirmError] = useState<
        string | null
    >(null)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const passwordValidationErrors = validatePassword(formData.password)

        if (passwordValidationErrors.length > 0) {
            setPasswordErrors(passwordValidationErrors)
            return
        }

        if (!passwordsMatch(formData.password, formData.passwordConfirm)) {
            setPasswordConfirmError('Passwords do not match.')
            return
        }

        try {
            const response = await axios.post(`${signupApiUrl}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            console.log('Sign up successful:', response.data)

            // Handle success (e.g., redirect, show success message, etc.)
            // Example: router.push('/dashboard')
        } catch (error: any) {
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

        setFormData((prev) => {
            const updated = { ...prev, [id]: value }

            // Validate password
            if (id === 'password') {
                const errors = validatePassword(value)
                setPasswordErrors(errors)

                // Also re-check confirmation
                if (prev.passwordConfirm) {
                    setPasswordConfirmError(
                        value !== prev.passwordConfirm
                            ? 'Passwords do not match.'
                            : null
                    )
                }
            }

            // Validate confirmation
            if (id === 'passwordConfirm') {
                setPasswordConfirmError(
                    value !== prev.password ? 'Passwords do not match.' : null
                )
            }

            return updated
        })
    }

    function formatDate(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 8)

        if (digits.length <= 2) {
            return digits
        }

        if (digits.length <= 4) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`
        }

        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatDate(e.target.value)

        setFormData((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                dateOfBirth: formatted,
            },
        }))
    }

    console.log(formData)

    function validatePassword(password: string) {
        const errors: string[] = []

        if (password.length < 9) {
            errors.push('Must be at least 9 characters long.')
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Must contain at least one uppercase letter.')
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Must contain at least one number.')
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Must contain at least one special character.')
        }

        return errors
    }

    function passwordsMatch(password: string, confirm: string) {
        return password === confirm
    }

    const isPasswordValid = passwordErrors.length > 0 || !formData.password
    const isPasswordConfirmValid =
        !!passwordConfirmError || !formData.passwordConfirm

    return (
        <div className="form-wrapper">
            <form
                className="form-contents"
                onSubmit={handleSignUp}
                suppressHydrationWarning
            >
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
                        suppressHydrationWarning
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
                        suppressHydrationWarning
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
                        suppressHydrationWarning
                        className="form-input"
                        type="text"
                        id="dateOfBirth"
                        placeholder="DD/MM/YYYY"
                        value={formData.profile.dateOfBirth}
                        onChange={handleDateChange}
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        disabled={isLoading}
                        maxLength={10}
                    />
                </div>

                <div className="form-input-container">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        suppressHydrationWarning
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
                        suppressHydrationWarning
                        className={`form-input ${isPasswordValid ? 'alert' : ''}`}
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
                        src={showPassword ? EyeOpen : EyeClosed}
                        alt=""
                        className="password-visibilty"
                        onClick={() => setShowPassword((prev) => !prev)}
                    />
                </div>
                {passwordErrors.length > 0 && (
                    <ul className="error-message-wrapper">
                        {passwordErrors.map((err) => (
                            <li key={err} className="error-message">
                                {err}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="form-input-container password-wrapper">
                    <label className="form-label" htmlFor="passwordConfirm">
                        Password Confirm
                    </label>
                    <input
                        suppressHydrationWarning
                        className={`form-input ${isPasswordConfirmValid && 'alert'}`}
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
                        src={showPasswordConfirm ? EyeOpen : EyeClosed}
                        alt=""
                        className="password-visibilty"
                        onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    />
                </div>
                {passwordConfirmError && (
                    <div className="error-message-wrapper">
                        <p className="error-message">{passwordConfirmError}</p>
                    </div>
                )}

                <Button
                    btnType="submit"
                    isDisabled={
                        isLoading || isPasswordValid || isPasswordConfirmValid
                    }
                >
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </form>
        </div>
    )
}
