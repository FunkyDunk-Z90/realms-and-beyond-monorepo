'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react'
import axios from 'axios'
import { I_Identity, I_SignUpDataProps } from '@rnb/types'

interface UserContextType {
    user: I_Identity | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    signUp: (signUpData: I_SignUpDataProps) => Promise<void>
    updateUser: (updateData: Partial<I_Identity>) => Promise<void>
    refreshUser: () => Promise<void>
    error: string | null
    clearError: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const API_BASE_URL = 'http://localhost:5674/api/v1'

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<I_Identity | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    // Check authentication status on mount
    const checkAuthStatus = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(
                `${API_BASE_URL}/user/is-logged-in`
            )

            console.log(response)

            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
            } else {
                setUser(null)
            }
        } catch (err: any) {
            console.error('Auth check failed:', err)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        checkAuthStatus()
    }, [checkAuthStatus])

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.post(`${API_BASE_URL}/user/login`, {
                email,
                password,
            })

            console.log(response)

            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true)
            setError(null)

            await axios.post(`${API_BASE_URL}/user/logout`)
            setUser(null)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Logout failed'
            setError(errorMessage)
            console.error('Logout error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const signUp = async (signUpData: I_SignUpDataProps) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.post(
                `${API_BASE_URL}/user/sign-up`,
                signUpData
            )

            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Sign up failed'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const updateUser = async (updateData: Partial<I_Identity>) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.patch(
                `${API_BASE_URL}/user/update-my-account`,
                updateData
            )

            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Update failed'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const refreshUser = async () => {
        await checkAuthStatus()
    }

    const value: UserContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signUp,
        updateUser,
        refreshUser,
        error,
        clearError,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
