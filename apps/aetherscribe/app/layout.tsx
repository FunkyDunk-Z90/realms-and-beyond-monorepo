import type { ReactNode } from 'react'
import { UserProvider } from '@/lib/context/UserContext'
import AuthRouter from '@/lib/features/AuthRouter'

import AppLayout from './(app)/layout'

export const metadata = {
    title: 'Aetherscribe',
    description: 'A TTRPG content creation/sharing site',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="app-wrapper">
                <UserProvider>
                    <AuthRouter>{<AppLayout children={children} />}</AuthRouter>
                </UserProvider>
            </body>
        </html>
    )
}
