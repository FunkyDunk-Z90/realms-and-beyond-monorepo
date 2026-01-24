'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/context/UserContext'
import { useRnBAccount } from '@/lib/context/NexusAnvilContext'

export default function Dashboard() {
    const router = useRouter()
    const { user, logout } = useUser()
    const { rnbAccount, hasRnBAccount, isLoading } = useRnBAccount()

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
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                {rnbAccount?.avatar && (
                                    <img
                                        src={rnbAccount.avatar}
                                        alt={rnbAccount.username}
                                        className="h-8 w-8 rounded-full mr-2"
                                    />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    {rnbAccount?.username}
                                </span>
                            </div>
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
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome back, {rnbAccount?.username}!
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Here's your adventure hub
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Player Characters
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {rnbAccount?.content
                                                .playerCharacters.length || 0}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Worlds
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {rnbAccount?.content.worlds
                                                .length || 0}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Campaigns
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {rnbAccount?.content.campaigns
                                                .length || 0}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {rnbAccount?.subscription && (
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Subscription Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tier
                                    </p>
                                    <p className="text-base font-medium text-gray-900 capitalize">
                                        {rnbAccount.subscription.tier}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Status
                                    </p>
                                    <p className="text-base font-medium text-gray-900 capitalize">
                                        {rnbAccount.subscription.status}
                                    </p>
                                </div>
                                {rnbAccount.subscription.renewsOn && (
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Renews On
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {new Date(
                                                rnbAccount.subscription.renewsOn
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
                                <h4 className="font-medium text-gray-900">
                                    Create Character
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Start a new adventure
                                </p>
                            </button>
                            <button className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
                                <h4 className="font-medium text-gray-900">
                                    Build World
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Create your realm
                                </p>
                            </button>
                            <button className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
                                <h4 className="font-medium text-gray-900">
                                    Start Campaign
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Launch a new story
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
