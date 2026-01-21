'use client'

import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'

interface I_HeaderProps {
    companyBanner?: StaticImageData
    companyLogo?: StaticImageData
    companyName: string
    navigationLink?: string
}

export const Header = ({
    companyLogo,
    companyBanner,
    companyName,
    navigationLink,
}: I_HeaderProps) => {
    const router = useRouter()

    const handleNavigate = () => {
        router.push(`/${navigationLink}`)
    }

    return (
        <div className="wrapper-header">
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
                <h1 className="title-company" onClick={() => handleNavigate()}>
                    {companyName}
                </h1>
            </div>
        </div>
    )
}
