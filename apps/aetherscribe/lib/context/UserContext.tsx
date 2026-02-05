'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { I_Identity, I_AetherscribeSignup, I_LoginEmailType } from '@rnb/types'

import { useCheckAuthStatus } from '../hooks/useAuthStatus'
import { useLoginFunction } from '../hooks/useLogin'
import { useLogoutFunction } from '../hooks/useLogout'
import { useSignUpFunction } from '../hooks/useSignUp'
import { useUpdateUserFunction } from '../hooks/useUpdateUser'
import { useRefreshUserFunction } from '../hooks/useRefreshUser'

interface I_UserContextProps {
    user: I_Identity | null
    isLoading: boolean
    login: (formData: I_LoginEmailType) => Promise<void>
    logout: () => Promise<void>
    signUp: (signUpData: I_AetherscribeSignup) => Promise<void>
    updateUser: (updateData: Partial<I_Identity>) => Promise<void>
    refreshUser: () => Promise<void>
    error: string | null
    clearError: () => void
}

const UserContext = createContext<I_UserContextProps | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<I_Identity | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const clearError = () => setError(null)

    // Modular hooks
    const checkAuthStatus = useCheckAuthStatus({ setUser, setIsLoading })
    const login = useLoginFunction({ setUser, setIsLoading, setError })
    const logout = useLogoutFunction({ setUser, setIsLoading, setError })
    const signUp = useSignUpFunction({ setUser, setIsLoading, setError })
    const updateUser = useUpdateUserFunction({
        setUser,
        setIsLoading,
        setError,
    })
    const refreshUser = useRefreshUserFunction({ checkAuthStatus })

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                signUp,
                updateUser,
                refreshUser,
                error,
                clearError,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
