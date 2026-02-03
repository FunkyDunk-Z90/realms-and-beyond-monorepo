'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { I_HeaderProps } from '@rnb/types'
import { Navbar } from '../ui/Navbar'

export const Header = ({
    companyLogo,
    companyBanner,
    companyName,
    rootLink,
    navbarItems,
}: I_HeaderProps) => {
    const router = useRouter()
    const headerHeight = 80
    const headerRef = useRef<HTMLDivElement>(null)
    const lastScrollY = useRef(0)
    const accumulatedDelta = useRef(0)
    const smoothedVelocity = useRef(0)
    const lastTimestamp = useRef(0)
    const [isHidden, setIsHidden] = useState(false)
    const [scrollLock, setScrollLock] = useState(false)

    const handleNavigate = () => {
        router.push(`/${rootLink}`)
    }

    useEffect(() => {
        if (scrollLock) {
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
        } else {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }

        return () => {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
    }, [scrollLock])

    useEffect(() => {
        const SHOW_THRESHOLD = 50 // px accumulated up → show
        const VELOCITY_ALPHA = 0.2 // EMA smoothing 0–1; lower = smoother
        const MIN_VELOCITY = 0.4 // ignore frames slower than this

        const onScroll = () => {
            const currentY = window.scrollY
            const rawDelta = currentY - lastScrollY.current

            // ── top-of-page guard ─────────────────────────────────────
            // always visible while within the header height
            if (currentY < headerHeight) {
                setIsHidden(false)
                lastScrollY.current = currentY
                accumulatedDelta.current = 0
                smoothedVelocity.current = 0
                return
            }

            // ── scrolling down → hide immediately, no threshold ───────
            if (rawDelta > 0) {
                setIsHidden(true)
                // reset the show-accumulator so a new upward scroll has
                // to travel the full SHOW_THRESHOLD before revealing
                accumulatedDelta.current = 0
                smoothedVelocity.current = 0
                lastScrollY.current = currentY
                lastTimestamp.current = performance.now()
                return
            }

            // ── scrolling up → velocity-smoothed accumulator ─────────
            // only the upward path uses smoothing so that trackpad bounce
            // and momentum-scroll micro-reversals don't flash the header
            const now = performance.now()
            const elapsed = now - lastTimestamp.current

            if (elapsed > 0) {
                const rawVelocity = rawDelta / elapsed
                smoothedVelocity.current =
                    VELOCITY_ALPHA * rawVelocity +
                    (1 - VELOCITY_ALPHA) * smoothedVelocity.current
            }

            if (Math.abs(smoothedVelocity.current) >= MIN_VELOCITY) {
                accumulatedDelta.current += rawDelta
            }

            if (accumulatedDelta.current < -SHOW_THRESHOLD) {
                setIsHidden(false)
                accumulatedDelta.current = 0
            }

            lastScrollY.current = currentY
            lastTimestamp.current = now
        }

        lastTimestamp.current = performance.now()

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [headerHeight])

    return (
        <>
            <div
                className={`header-overlay ${scrollLock ? 'active' : ''}`}
            ></div>
            <div
                className={`header-wrapper ${isHidden ? 'hidden' : ''}`}
                ref={headerRef}
            >
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
                    <Navbar items={navbarItems} scrollLock={setScrollLock} />
                </div>
            </div>
        </>
    )
}
