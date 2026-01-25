'use client'

import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'
import { Navbar } from '../ui/Navbar'
import { I_NavBarProps } from '@rnb/types'

interface I_HeaderProps {
    companyBanner?: StaticImageData
    companyLogo?: StaticImageData
    companyName: string
    rootLink?: string
    navbarData: I_NavBarProps
}

export const Header = ({
    companyLogo,
    companyBanner,
    companyName,
    rootLink,
    navbarData,
}: I_HeaderProps) => {
    const router = useRouter()
    const { items } = navbarData

    const handleNavigate = () => {
        router.push(`/${rootLink}`)
    }

    return (
        <div className="wrapper-header">
            <div className="header-contents">
                {companyLogo && (
                    <Image
                        src={companyLogo}
                        alt={`${companyName}'s logo`}
                        className="logo-company"
                        onClick={() => handleNavigate()}
                    />
                )}
                {companyBanner && (
                    <Image
                        src={companyBanner}
                        alt={`${companyName}'s banner`}
                        className="banner-company"
                        onClick={() => handleNavigate()}
                    />
                )}
                <div className="title-wrapper">
                    <h1
                        className="title-company"
                        onClick={() => handleNavigate()}
                    >
                        {companyName}
                    </h1>
                </div>
                <Navbar items={items} />
            </div>
        </div>
    )
}
