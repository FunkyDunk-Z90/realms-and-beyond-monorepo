// app/(protected)/dashboard/page.tsx
import { Suspense } from 'react'
import { SuspenseSection, DataSkeleton } from '@/lib/features/SuspenseWrappers'

// These would be your actual async components that fetch data
async function UserStats() {
    // Simulating data fetch - replace with actual API call
    // const stats = await fetch('/api/stats').then(r => r.json())

    return (
        <div className="stats-card">
            <h3>User Stats</h3>
            <p>Characters: 5</p>
            <p>Campaigns: 2</p>
        </div>
    )
}

async function RecentActivity() {
    // Simulating slower data fetch
    // const activity = await fetch('/api/activity').then(r => r.json())

    return (
        <div className="activity-list">
            <h3>Recent Activity</h3>
            <ul>
                <li>Updated character sheet</li>
                <li>Joined new campaign</li>
                <li>Created spell book</li>
            </ul>
        </div>
    )
}

async function QuickActions() {
    // Fast-loading component
    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button>Create Character</button>
            <button>Join Campaign</button>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>

            <div className="dashboard-grid">
                {/* Each section loads independently */}
                <SuspenseSection type="card">
                    <UserStats />
                </SuspenseSection>

                <SuspenseSection type="list">
                    <RecentActivity />
                </SuspenseSection>

                <SuspenseSection type="card">
                    <QuickActions />
                </SuspenseSection>
            </div>
        </div>
    )
}

// Styles for dashboard grid
// .dashboard-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//   gap: 1.5rem;
//   margin-top: 2rem;
// }
