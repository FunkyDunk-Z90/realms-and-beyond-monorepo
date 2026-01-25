import type { I_Link, I_BreadcrumbItem } from '../navigationTypes'

export interface I_NavBarProps {
    items: I_Link[]
    breadcrumbs?: I_BreadcrumbItem[]
    onNavigate?: (link: I_Link) => void
}
