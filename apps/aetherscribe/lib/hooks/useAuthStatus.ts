'use client'

import { useEffect, useCallback } from 'react'
import axios from 'axios'
import { env } from '../utils/validateEnv'
import { I_Identity } from '@rnb/types'

interface I_AuthStatusProps {
    setUser: React.Dispatch<React.SetStateAction<I_Identity | null>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function useCheckAuthStatus({
    setUser,
    setIsLoading,
}: I_AuthStatusProps) {
    const checkAuthStatus = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(
                `http://localhost:5674/user/is-logged-in`,
                {
                    withCredentials: true,
                }
            )
            if (response.data.status === 'success' && response.data.identity) {
                setUser(response.data.identity)
            } else {
                setUser(null)
            }
        } catch (err) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [setUser, setIsLoading])

    useEffect(() => {
        checkAuthStatus()
    }, [checkAuthStatus])

    return checkAuthStatus
}
