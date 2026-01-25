import type { ReactNode } from 'react'
import { Header, Footer, Navbar } from '@rnb/modularix'
import { UserProvider } from '../lib/context/UserContext'
import AuthRouter from '@/lib/features/AuthRouter'
import { RnBAccountProvider } from '@/lib/context/NexusAnvilContext'

import '@rnb/styles'

import Logo from '../assets/dragon.jpg'
import { I_NavBarProps } from '@rnb/types'

export const metadata = {
    title: 'Nexus Anvil',
    description: 'A TTRPG content creation/sharing site',
}

const navbarData: I_NavBarProps = {
    items: [
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
    ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="app-wrapper">
                <UserProvider>
                    <RnBAccountProvider>
                        <Header
                            companyName="Nexus Anvil"
                            companyLogo={Logo}
                            rootLink="dashboard"
                            navbarData={navbarData}
                        />
                        <section className="page-wrapper">
                            {/* <AuthRouter> */}
                            {children}
                            {/* </AuthRouter> */}
                        </section>
                        <Footer
                            companyName={'Nexus Anvil'}
                            copyright="@copyright RealmsAndBeyond ltd. 2026"
                        />
                    </RnBAccountProvider>
                </UserProvider>
            </body>
        </html>
    )
}
