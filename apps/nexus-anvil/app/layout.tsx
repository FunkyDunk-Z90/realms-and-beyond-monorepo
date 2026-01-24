import type { ReactNode } from 'react'
import { Header, Footer } from '@rnb/modularix'
import { UserProvider } from '../lib/context/UserContext'
import AuthRouter from '@/lib/features/AuthRouter'
import { RnBAccountProvider } from '@/lib/context/NexusAnvilContext'

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
                    <RnBAccountProvider>
                        <Header
                            companyName="Nexus Anvil"
                            companyLogo={Logo}
                            navigationLink="dashboard"
                        />
                        <section className="page-wrapper">
                            <AuthRouter>{children}</AuthRouter>
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
