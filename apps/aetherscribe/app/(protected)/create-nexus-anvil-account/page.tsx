'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRnBAccount } from '@/lib/context/AetherscribeContext'
import { useUser } from '@/lib/context/UserContext'

export default function CreateRnBAccountPage() {
    const router = useRouter()
    const { user } = useUser()
    const { createRnBAccount, isLoading, error, clearError } = useRnBAccount()

    const [formData, setFormData] = useState({
        username: '',
        avatar: '',
        subscriptionTier: 'basic',
        renewlCycle: '1-month',
    })

    const [validationError, setValidationError] = useState<string | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setValidationError(null)
        clearError()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.username.trim()) {
            setValidationError('Username is required')
            return
        }

        if (formData.username.length < 3 || formData.username.length > 30) {
            setValidationError('Username must be between 3 and 30 characters')
            return
        }

        try {
            await createRnBAccount({
                username: formData.username.trim(),
                avatar: formData.avatar.trim() || undefined,
                subscriptionTier: formData.subscriptionTier,
                renewlCycle: formData.renewlCycle,
            })

            // Success - redirect to dashboard
            router.push('/dashboard')
        } catch (err) {
            // Error is already set in context
            console.error('Failed to create account:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Your Realms & Beyond Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome {user?.profile.firstName}! Set up your gaming
                        profile to get started.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your username"
                                minLength={3}
                                maxLength={30}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                3-30 characters
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Avatar URL (optional)
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="text"
                                value={formData.avatar}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="https://example.com/avatar.jpg"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Leave blank for default avatar
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="subscriptionTier"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Subscription Tier
                            </label>
                            <select
                                id="subscriptionTier"
                                name="subscriptionTier"
                                value={formData.subscriptionTier}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            >
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="premium-plus">
                                    Premium Plus
                                </option>
                                <option value="family">Family</option>
                                <option value="duo">Duo</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="renewlCycle"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Renewal Cycle
                            </label>
                            <select
                                id="renewlCycle"
                                name="renewlCycle"
                                value={formData.renewlCycle}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            >
                                <option value="never">Never</option>
                                <option value="1-month">1 Month</option>
                                <option value="3-months">3 Months</option>
                                <option value="6-months">6 Months</option>
                                <option value="12-months">12 Months</option>
                                <option value="18-months">18 Months</option>
                                <option value="24-months">24 Months</option>
                            </select>
                        </div>
                    </div>

                    {(validationError || error) && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {validationError || error}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isLoading
                                ? 'Creating Account...'
                                : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
