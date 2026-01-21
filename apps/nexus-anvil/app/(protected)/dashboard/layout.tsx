import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return <section className="page-wrapper">{children}</section>
}
