import type { ReactNode } from 'react'

export const metadata = {
    title: 'Modularix Docs',
    description: 'Component documentation for the Modularix UI library.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
