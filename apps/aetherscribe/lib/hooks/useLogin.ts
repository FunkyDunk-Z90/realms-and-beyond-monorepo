'use client'

import axios from 'axios'
import { I_Identity, I_LoginEmailType } from '@rnb/types'
import { env } from '../utils/validateEnv'

interface IProps {
    setUser: React.Dispatch<React.SetStateAction<I_Identity | null>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useLoginFunction({ setUser, setIsLoading, setError }: IProps) {
    return async (formData: I_LoginEmailType) => {
        try {
            setIsLoading(true)
            setError(null)
            const { email, password } = formData

            const response = await axios.post(
                'http://localhost:5674/api/v1/user/login',
                { email, password },
                { withCredentials: true }
            )

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
}
