'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { useUser } from '@/lib/context/UserContext'
import { useRnBAccount } from '@/lib/context/NexusAnvilContext'
import { I_RnBAccount } from '@rnb/types'

import { Button } from '@rnb/modularix'

import Avatar from '../../../assets/dragon.jpg'

const offlineRnBAccount: I_RnBAccount = {
    username: 'FunkyDunk-Z90',
    avatar: Avatar,
    createdAt: '01/01/2026',
    identityId: '0015674',
    content: {
        campaigns: [
            {
                contentId: 'campaign-001',
                contentName: 'The Aetherscape Saga',
            },
        ],
        playerCharacters: [
            {
                contentId: 'character-001',
                contentName: 'Bruce Wayne',
            },
            {
                contentId: 'character-002',
                contentName: 'Clark Kent',
            },
            {
                contentId: 'character-003',
                contentName: 'Peter Parker',
            },
        ],
        worlds: [
            {
                contentId: 'world-001',
                contentName: 'Oru',
            },
        ],
    },
    updatedAt: '01/01/2026',
}

export default function Dashboard() {
    const router = useRouter()
    const { user, logout } = useUser()
    // const { rnbAccount, hasRnBAccount, isLoading } = useRnBAccount()
    const hasRnBAccount = true
    const isLoading = false

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const handleCreateRnBAccount = () => {
        router.push('/create-rnb-account')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // User doesn't have RnB account
    if (!hasRnBAccount) {
        return (
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Realms & Beyond
                                </h1>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-4">
                                    {user?.profile.firstName}{' '}
                                    {user?.profile.lastNames}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome to Realms & Beyond!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You're almost ready to start your adventure.
                                    Create your gaming profile to unlock all
                                    features.
                                </p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        What You'll Get Access To:
                                    </h3>
                                    <ul className="text-left text-sm text-blue-800 space-y-2">
                                        <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            Create and manage player characters
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            Build custom worlds and campaigns
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            Access premium content and features
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            Join the gaming community
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleCreateRnBAccount}
                                    className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
                                >
                                    Create Gaming Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // User has RnB account - show full dashboard

    const { username, content, identityId, avatar, subscription } =
        offlineRnBAccount
    return (
        <div className="dashboard-wrapper">
            <h2>Welcome back, {username}!</h2>
            <div className="section-wrapper">
                <h2>My Account</h2>
                <div className="profile-info-wrapper">
                    <div className="profile-avatar-wrapper">
                        {avatar && (
                            <Image
                                src={avatar}
                                alt={username}
                                className="user-avatar"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="adventure-hub-wrapper">
                <h3 className="section-title">Adventure Hub</h3>
                <div className="card-gallery-wrapper">
                    <h4>Characters</h4>
                    {content.playerCharacters.map((el) => (
                        <div
                            className="card-wrapper"
                            key={el.contentId as string}
                        >
                            <p>{el.contentName}</p>
                        </div>
                    ))}
                </div>
                <div className="card-gallery-wrapper">
                    <h4>Campaigns</h4>
                    {content.campaigns.map((el) => (
                        <div
                            className="card-wrapper"
                            key={el.contentId as string}
                        >
                            <p>{el.contentName}</p>
                        </div>
                    ))}
                </div>
                <div className="card-gallery-wrapper">
                    <h4>Worlds</h4>
                    {content.worlds.map((el, i) => (
                        <div
                            className="card-wrapper"
                            key={el.contentId as string}
                        >
                            <p>{el.contentName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
