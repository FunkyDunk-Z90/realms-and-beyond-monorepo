import { T_ImageType } from './globalTypes'

export interface I_Link {
    id: string
    label: string
    href: string
    icon?: T_ImageType
    iconName?: string
    external?: boolean
    isDisabled?: boolean
}

export interface I_BreadcrumbItem {
    label: string
    href?: string
}

export type T_RouteParamsRaw = Record<string, string | string[]>
