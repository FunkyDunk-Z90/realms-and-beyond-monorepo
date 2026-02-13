'use client'

import axios from 'axios'
import { env } from '../utils/validateEnv'

interface IProps {
    setUser: React.Dispatch<React.SetStateAction<any>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useLogoutFunction({ setUser, setIsLoading, setError }: IProps) {
    return async () => {
        try {
            setIsLoading(true)
            setError(null)
            await axios.post(
                `http://localhost:5674/user/logout`,
                {},
                { withCredentials: true }
            )
            setUser(null)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Logout failed'
            setError(errorMessage)
            console.error('Logout error:', err)
        } finally {
            setIsLoading(false)
        }
    }
}
