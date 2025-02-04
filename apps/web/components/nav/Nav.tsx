"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { UserDrawer } from "@/components/ui/userDrawer"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import ChangeAccountTypeView from "@/components/adminDashboard/sections/ChangeAccountTypeView"
import { RotatingArrows } from "@/components/ui/rotating-arrows"

interface NavProps {
    className?: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const { data: session } = useSession()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const [isLogoClicked, setIsLogoClicked] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Add scroll-based animations
    const { scrollY } = useScroll()
    const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"])
    const backdropFilter = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(10px)"])

    const handleLogoClick = () => {
        setRotation((prev) => prev + 360)
    }

    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
    }

    const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className="relative">
            <motion.div
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isMobileMenuOpen ? "text-white bg-darkBlue/75 hover:text-orange-100" : "text-darkBlue hover:bg-gray-100/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
                {pathname === href && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" layoutId="underline" />
                )}
            </motion.div>
        </Link>
    )

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false)
            }
        }

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleOutsideClick)
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [isMobileMenuOpen])

    return (
        <motion.nav
            className={`fixed w-full py-4 px-4 md:px-4 z-50 transition-all duration-300 ${className}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
                backgroundColor,
                backdropFilter,
            }}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        onClick={handleLogoClick}
                        animate={{ rotate: rotation }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="cursor-pointer"
                    >
                        <Image src="/assets/images/logo.svg" alt="MedFlow logo" width={30} height={30} className="object-contain" />
                    </motion.div>
                    <motion.p
                        className={`text-xl font-bold ${isMobileMenuOpen ? "text-white" : "text-black"} cursor-pointer`}
                        animate={{ color: isMobileMenuOpen ? "#ff5722" : "#000000" }}
                        onClick={handleLogoClick}
                    >
                        MedFlow
                    </motion.p>
                </Link>

                {!session?.user ? (
                    <>
                        <div className="hidden md:flex items-center space-x-4">
                            <NavItem href="/new-patient">New Patient</NavItem>
                            <span className={`text-lg ${isMobileMenuOpen ? "text-white" : "text-darkBlue"}`}></span>
                            <NavItem href="/about">About</NavItem>
                            <span className={`text-lg ${isMobileMenuOpen ? "text-white" : "text-darkBlue"}`}></span>
                            <NavItem href="/auth/login">Login</NavItem>
                        </div>
                        <motion.button
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Menu size={24} className={`${isMobileMenuOpen ? "text-orange-500" : "text-darkBlue"}`} />
                        </motion.button>
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        {session.user.isAdmin && (
                            <div className="relative">
                                <motion.button
                                    onClick={() => setIsDialogOpen(!isDialogOpen)}
                                    className="flex items-center justify-center p-2 rounded-full border-2 border-darkBlue text-darkBlue hover:bg-darkBlue hover:text-white transition-colors"
                                    aria-label="Change Account Type"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <RotatingArrows isRotating={isDialogOpen} />
                                </motion.button>
                                <AnimatePresence>
                                    {isDialogOpen && (
                                        <motion.div
                                            className="absolute right-0 mt-2 z-50"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChangeAccountTypeView onClose={() => setIsDialogOpen(false)} isDialog={isDialogOpen} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <motion.button
                            onClick={() => setIsDrawerOpen(true)}
                            className="flex items-center justify-center"
                            aria-label="Open user menu"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {session.user.image ? (
                                <Image
                                    src={session.user.image || "/placeholder.svg"}
                                    width={37}
                                    height={37}
                                    className="rounded-full"
                                    alt="profile"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-darkBlue font-semibold ml-3">
                                    {getInitials(session.user.firstName, session.user.lastName)}
                                </div>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {!session?.user && isMobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        className="md:hidden mt-4 space-y-2 p-4 rounded-md text"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <NavItem href="/new-patient">New Patient</NavItem>
                        <NavItem href="/about">About</NavItem>
                        <NavItem href="/auth/login">Login</NavItem>
                    </motion.div>
                )}
            </AnimatePresence>

            {session?.user && <UserDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} user={session.user} />}
        </motion.nav>
    )
}

export default Nav

