'use client'

import axios from 'axios'
import { I_SignUpDataProps, I_Identity } from '@rnb/types'

interface IProps {
    setUser: React.Dispatch<React.SetStateAction<I_Identity | null>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useSignUpFunction({ setUser, setIsLoading, setError }: IProps) {
    return async (signUpData: I_SignUpDataProps) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.post(
                `http://localhost:5674/aetherscribe/signup`,
                signUpData,
                {
                    withCredentials: true,
                }
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
}
