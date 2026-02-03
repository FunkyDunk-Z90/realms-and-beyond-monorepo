import { StaticImageData } from 'next/image'
import { I_Link } from '../navigationTypes'

export interface I_HeaderProps {
    companyBanner?: StaticImageData
    companyLogo?: StaticImageData
    companyName: string
    rootLink?: string
    navbarItems: I_Link[]
}
