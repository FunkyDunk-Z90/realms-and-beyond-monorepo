'use client'

import type { ReactNode } from 'react'
import { Header, Footer } from '@rnb/modularix'
import { useUser } from '@/lib/context/UserContext'
import { navbarData } from '@/lib/data/navigationData'
import Logo from '@/assets/aetherscribe-logo.jpg'

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user } = useUser()

    return (
        <>
            <Header
                companyName="Aetherscribe"
                companyLogo={Logo}
                rootLink="dashboard"
                navbarItems={navbarData}
                hasAuth={user}
            />

            <section className="page-wrapper">{children}</section>
            <Footer
                companyName="Aetherscribe"
                copyright="@copyright RealmsAndBeyond ltd. 2026"
            />
        </>
    )
}
