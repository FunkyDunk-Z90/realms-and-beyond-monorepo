// lib/components/SuspenseWrappers.tsx
import { Suspense, ReactNode } from 'react'

// Generic skeleton for data sections
export function DataSkeleton({
    type = 'card',
}: {
    type?: 'card' | 'list' | 'text'
}) {
    if (type === 'card') {
        return <div className="skeleton-card" />
    }
    if (type === 'list') {
        return (
            <div className="skeleton-pulse">
                <div className="skeleton-text" />
                <div className="skeleton-text" />
                <div className="skeleton-text" />
            </div>
        )
    }
    return <div className="skeleton-text" />
}

// Wrapper for sections that load independently
export function SuspenseSection({
    children,
    fallback,
    type = 'card',
}: {
    children: ReactNode
    fallback?: ReactNode
    type?: 'card' | 'list' | 'text'
}) {
    return (
        <Suspense fallback={fallback || <DataSkeleton type={type} />}>
            {children}
        </Suspense>
    )
}

// Example usage in dashboard:
// <SuspenseSection type="card">
//   <UserStats />
// </SuspenseSection>
// <SuspenseSection type="list">
//   <RecentActivity />
// </SuspenseSection>
