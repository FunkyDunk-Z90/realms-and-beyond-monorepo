'use client'

interface IProps {
    checkAuthStatus: () => Promise<void>
}

export function useRefreshUserFunction({ checkAuthStatus }: IProps) {
    return async () => {
        await checkAuthStatus()
    }
}
