'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react'
import { useUser } from './UserContext'

import { I_AetherScribeAccountProps } from '@rnb/types'

interface RnBAccountContextType {
    rnbAccount: I_AetherScribeAccountProps | null
    hasRnBAccount: boolean
    isLoading: boolean
    error: string | null
    createRnBAccount: (data: CreateRnBAccountData) => Promise<void>
    updateRnBAccount: (
        accountId: string,
        data: UpdateRnBAccountData
    ) => Promise<void>
    refreshRnBAccount: () => Promise<void>
    clearError: () => void
}

interface CreateRnBAccountData {
    username: string
    avatar?: string
    subscriptionTier?: string
    renewlCycle?: string
}

interface UpdateRnBAccountData {
    username?: string
    avatar?: string
}

const RnBAccountContext = createContext<RnBAccountContextType | undefined>(
    undefined
)

const API_BASE_URL = 'http://localhost:5674/api/v1'

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'API request failed')
    }

    return data
}

export function RnBAccountProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, isLoading: userLoading } = useUser()
    const [rnbAccount, setRnbAccount] =
        useState<I_AetherScribeAccountProps | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    // Check if user has RnB accounts
    const checkRnBAccount = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setRnbAccount(null)
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            // Get all RnB accounts for this user
            const data = await apiCall('/rnb-account/get')

            if (data.status === 'success' && data.accounts?.length > 0) {
                // Use the first account (or you could let user choose)
                const account = data.accounts[0]
                setRnbAccount(account)
            } else {
                setRnbAccount(null)
            }
        } catch (err: any) {
            console.error('Error checking RnB account:', err)
            setRnbAccount(null)
            // Don't set error here as not having an account is expected
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, user])

    // Check RnB account when user changes
    useEffect(() => {
        if (!userLoading) {
            checkRnBAccount()
        }
    }, [userLoading, checkRnBAccount])

    const createRnBAccount = async (data: CreateRnBAccountData) => {
        try {
            setIsLoading(true)
            setError(null)

            const result = await apiCall('/rnb-account/create', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            if (result.status === 'success' && result.account) {
                setRnbAccount(result.account)
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create RnB account'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const updateRnBAccount = async (
        accountId: string,
        data: UpdateRnBAccountData
    ) => {
        try {
            setIsLoading(true)
            setError(null)

            const result = await apiCall(`/rnb-account/update/${accountId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })

            if (result.status === 'success' && result.account) {
                setRnbAccount(result.account)
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update RnB account'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const refreshRnBAccount = async () => {
        await checkRnBAccount()
    }

    const value: RnBAccountContextType = {
        rnbAccount,
        hasRnBAccount: !!rnbAccount,
        isLoading,
        error,
        createRnBAccount,
        updateRnBAccount,
        refreshRnBAccount,
        clearError,
    }

    return (
        <RnBAccountContext.Provider value={value}>
            {children}
        </RnBAccountContext.Provider>
    )
}

export function useRnBAccount() {
    const context = useContext(RnBAccountContext)
    if (context === undefined) {
        throw new Error(
            'useRnBAccount must be used within a RnBAccountProvider'
        )
    }
    return context
}
