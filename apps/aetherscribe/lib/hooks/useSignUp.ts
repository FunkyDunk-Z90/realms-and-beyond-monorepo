'use client'

import axios from 'axios'
import {
    I_AetherscribeSignup,
    I_Identity,
    I_AetherScribeAccountProps,
} from '@rnb/types'

interface IProps {
    setUser: React.Dispatch<React.SetStateAction<I_Identity | null>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setAccountData: React.Dispatch<
        React.SetStateAction<I_AetherScribeAccountProps | null>
    >
}

export function useSignUpFunction({
    setUser,
    setIsLoading,
    setError,
    setAccountData,
}: IProps) {
    return async (signUpData: I_AetherscribeSignup) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.post(
                `http://localhost:5674/api/v1/aetherscribe/signup`,
                signUpData,
                {
                    withCredentials: true,
                }
            )

            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
                setAccountData(response.data.accountData)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Sign up failed'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }
}
