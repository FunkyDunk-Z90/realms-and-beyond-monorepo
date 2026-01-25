'use client'

import axios from 'axios'
import { I_Identity } from '@rnb/types'
import { env } from '../utils/validateEnv'

interface IProps {
    setUser: React.Dispatch<React.SetStateAction<I_Identity | null>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useUpdateUserFunction({
    setUser,
    setIsLoading,
    setError,
}: IProps) {
    return async (updateData: Partial<I_Identity>) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await axios.patch(
                `http://localhost:5674/user/update-my-account`,
                updateData,
                {
                    withCredentials: true,
                }
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
}
