import type { ReactNode } from 'react'
import { Header, Footer } from '@rnb/modularix'
import { UserProvider } from '../lib/context/UserContext'
import AuthRouter from '@/lib/features/AuthRouter'
import { RnBAccountProvider } from '@/lib/context/AetherscribeContext'

// import '@rnb/styles'

import Logo from '../assets/aetherscribe-logo.jpg'
import { I_Link } from '@rnb/types'

export const metadata = {
    title: 'Aetherscribe',
    description: 'A TTRPG content creation/sharing site',
    icons: {
        icon: '/favicon.ico',
    },
}

const navbarData: I_Link[] = [
    {
        href: '/dashboard',
        id: 'dashboard',
        label: 'Dashboard',
    },
    {
        href: '/adventure-hub',
        id: 'adventure-hub',
        label: 'Adventure Hub',
    },
    {
        href: '/my-account',
        id: 'my-account',
        label: 'My Account',
    },
    {
        href: '/settings',
        id: 'settings',
        label: 'Settings',
    },
]

const logout = () => null

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="app-wrapper">
                <UserProvider>
                    <RnBAccountProvider>
                        <Header
                            companyName="Aetherscribe"
                            companyLogo={Logo}
                            rootLink="dashboard"
                            navbarItems={navbarData}
                        />
                        <section className="page-wrapper">
                            <AuthRouter>{children}</AuthRouter>
                        </section>
                        <Footer
                            companyName={'Aetherscribe'}
                            copyright="@copyright RealmsAndBeyond ltd. 2026"
                        />
                    </RnBAccountProvider>
                </UserProvider>
            </body>
        </html>
    )
}
