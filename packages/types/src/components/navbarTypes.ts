import type { I_Link, I_BreadcrumbItem } from '../navigationTypes'
import type { SetStateAction, Dispatch } from 'react'

export interface I_NavBarProps {
    items: I_Link[]
    breadcrumbs?: I_BreadcrumbItem[]
    onNavigate?: (link: I_Link) => void
    scrollLock: Dispatch<SetStateAction<boolean>>
}
