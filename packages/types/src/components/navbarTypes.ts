import type { I_NavLink, I_BreadcrumbItem } from '../navigationTypes'

/**
 * A navigation bar item can be:
 * - A simple link
 * - A dropdown of links (optional)
 */
export interface I_NavBarItem {
    id: string

    /** Main label for the nav button */
    label: string

    /** Optional top-level link */
    link?: I_NavLink

    /** Optional list of nested navigation items */
    children?: I_NavLink[]

    /** Optional icon name reference */
    iconName?: string

    /** Disable interaction */
    disabled?: boolean
}

/**
 * Navigation bar props
 */
export interface I_NavBarProps {
    /** The items displayed in the main navigation bar */
    items: I_NavBarItem[]

    /** Optional breadcrumbs to show under the navbar */
    breadcrumbs?: I_BreadcrumbItem[]

    /** Triggered when a nav link is clicked */
    onNavigate?: (link: I_NavLink) => void

    /** Triggered when a dropdown item is clicked */
    onDropdownNavigate?: (link: I_NavLink) => void

    /**
     * Custom renderers (optional)
     */
    renderNavItem?: (item: I_NavBarItem, isOpen: boolean) => React.ReactNode
    renderDropdownItem?: (item: I_NavLink) => React.ReactNode
    renderBreadcrumb?: (item: I_BreadcrumbItem) => React.ReactNode
}
