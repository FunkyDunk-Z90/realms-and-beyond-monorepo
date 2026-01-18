import type { JSX, FC, SVGProps } from 'react'
import type { T_ImageSource } from '../nextTypes'
import type { I_NavLink } from '../navigationTypes'
import type { I_DropdownOption } from './dropdownTypes'

// --------------------------------------
// Sidebar Item Variants (Union Types)
// --------------------------------------

export type T_SidebarItemKind = 'link' | 'dropdown'

/** Shared base */
interface I_SidebarItemBase {
    id: string
    icon?: FC<SVGProps<SVGSVGElement>> | JSX.Element | T_ImageSource
    badge?: string
}

/** Single clickable item (no dropdown) */
export interface I_SidebarLinkItem extends I_SidebarItemBase {
    kind: 'link'
    link: I_NavLink
}

/** Dropdown item that uses the ACTUAL dropdown option types */
export interface I_SidebarDropdownItem extends I_SidebarItemBase {
    kind: 'dropdown'

    /**
     * The dropdown definition which includes:
     * - label
     * - value (optional)
     * - nested children
     * - icons, disabled, etc.
     */
    dropdown: I_DropdownOption
}

export type T_SidebarItem = I_SidebarLinkItem | I_SidebarDropdownItem

// --------------------------------------
// Sidebar Structure
// --------------------------------------

export interface I_SidebarSection {
    sectionName?: string
    sectionContents: T_SidebarItem[]
}

export interface I_SidebarHeader {
    logo?: T_ImageSource
    header?: string
}

export interface I_SidebarFooter {
    footerContents: I_SidebarSection
}

export interface I_SidebarData {
    header?: I_SidebarHeader
    content: I_SidebarSection[]
    footer?: I_SidebarFooter
}

export interface I_SidebarProps {
    sidebarData: I_SidebarData
    isMobile: boolean
}
