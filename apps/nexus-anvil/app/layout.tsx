import type { ReactNode } from 'react'
import { Header } from '@rnb/modularix'

import '@rnb/styles'

import { Logo } from '../../../packages/assets'

export const metadata = {
    title: 'Nexus Anvil',
    description: 'A TTRPG content creation/sharing site',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="app-wrapper">
                <Header
                    companyName="Realms & Beyond"
                    companyLogo={Logo}
                    navigationLink="dashboard"
                />
                {children}
            </body>
        </html>
    )
}
