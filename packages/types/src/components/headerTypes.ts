import { StaticImageData } from 'next/image'
import { I_Link } from '../navigationTypes'
import { I_Identity } from '../users/identityTypes'

export interface I_HeaderProps {
    companyBanner?: StaticImageData
    companyLogo?: StaticImageData
    companyName: string
    rootLink?: string
    navbarItems: I_Link[]
    hasAuth: I_Identity | null
}
