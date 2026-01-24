import type { ReactNode } from 'react'
import { Header, Footer } from '@rnb/modularix'
import { UserProvider } from '../lib/context/UserContext'
import AuthRouter from '@/lib/features/AuthRouter'

import '@rnb/styles'

import Logo from '../assets/dragon.jpg'

export const metadata = {
    title: 'Nexus Anvil',
    description: 'A TTRPG content creation/sharing site',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="app-wrapper">
                <UserProvider>
                    <Header
                        companyName="Realms & Beyond"
                        companyLogo={Logo}
                        navigationLink="dashboard"
                    />
                    <section className="page-wrapper">
                        <AuthRouter>{children}</AuthRouter>
                    </section>
                    <Footer
                        companyName={'Realms & Beyond'}
                        copyright="@copyright RealmsAndBeyond ltd. 2026"
                    />
                </UserProvider>
            </body>
        </html>
    )
}
