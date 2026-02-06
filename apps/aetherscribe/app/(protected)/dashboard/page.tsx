'use client'

import { useUser } from '@/lib/context/UserContext'
import Image from 'next/image'

export default function Dashboard() {
    const { user, accountData } = useUser()

    return (
        <div>
            <h1>Dashboard</h1>
            <p>{accountData?.username}</p>
        </div>
    )
}
