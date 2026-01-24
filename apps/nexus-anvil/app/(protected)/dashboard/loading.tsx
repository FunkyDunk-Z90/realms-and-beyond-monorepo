export default function DashboardLoading() {
    return (
        <div className="dashboard-loading">
            <div className="skeleton-pulse">
                <div className="skeleton-header" />
                <div className="skeleton-grid">
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                </div>
            </div>
        </div>
    )
}
