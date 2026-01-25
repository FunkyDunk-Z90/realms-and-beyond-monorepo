'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import { I_NavBarProps } from '@rnb/types'

export const Navbar = ({ items }: I_NavBarProps) => {
    const [isMobile, setIsMobile] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [openStatus, setOpenStatus] = useState('')
    const navbarRef = useRef<HTMLDivElement>(null)

    const pathName = usePathname()
    const activeIndex = items.findIndex((item) => item.href === pathName)
    const itemCount = items.length
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const [underlineWidth, setUnderlineWidth] = useState(0)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile() // run once on mount
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) {
                setIsActive(false)
                setOpenStatus('')
                setIsMobile(false)
            } else {
                setIsMobile(true)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                navbarRef.current &&
                !navbarRef.current.contains(e.target as Node)
            ) {
                setIsActive(false)
                if (openStatus === 'opened') {
                    setOpenStatus('closed')
                }
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [openStatus, isActive])

    const toggleNav = () => {
        setIsActive(!isActive)

        if (isMobile) {
            if (!openStatus || openStatus === 'closed') {
                setOpenStatus('opened')
            } else {
                setOpenStatus('closed')
            }
        }
    }

    useEffect(() => {
        if (activeIndex === -1) return

        const activeLink = linkRefs.current[activeIndex]

        if (activeLink) {
            setUnderlineWidth(activeLink.offsetWidth)
        }
    }, [activeIndex])

    return (
        <>
            <div
                ref={navbarRef}
                className={`burgerIcon ${isActive ? 'active' : ''} `}
                onClick={toggleNav}
            >
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>
            <nav className={`navbar-wrapper ${openStatus}`}>
                <ul className="nav-wrapper">
                    {items.map((navItem, i) => {
                        const { iconName, href, id, label, icon } = navItem
                        const isActive = pathName === href

                        return (
                            <li className="link-wrapper" key={id}>
                                {icon && (
                                    <div className="icon-wrapper">
                                        <Image
                                            src={icon as StaticImageData}
                                            alt={`link for ${label}`}
                                            className="nav-icon"
                                        />
                                        <p className="nav-icon-name">
                                            {iconName}
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href={href}
                                    ref={(el) => {
                                        linkRefs.current[i] = el
                                    }}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            </li>
                        )
                    })}
                    <span
                        className="nav-link-underline"
                        style={{
                            left: `calc(
                            ${(activeIndex / itemCount) * 100}% +
                            ${50 / itemCount}%
                            )`,
                            width: underlineWidth,
                            transform: 'translateX(-50%)',
                        }}
                    />
                </ul>
            </nav>
        </>
    )
}
