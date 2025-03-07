// components/ui/userDrawer.tsx
'use client'

import { Dispatch, SetStateAction } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Settings, ClipboardList, Grid3X3 } from 'lucide-react'
import Link from "next/link"
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface UserDrawerProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    user: {
        name?: string | null
        email?: string | null
        googleEmail?: string | null
        accountType?: string | null
        languages?: string[] | null
        countries?: string[] | null
        image?: string | null
        firstName?: string
        lastName?: string
        isAdmin?: boolean
    }
}

export function UserDrawer({ isOpen, setIsOpen, user }: UserDrawerProps) {
    const handleItemClick = () => {
        setIsOpen(false)
    }

    const menuItems = [
        { href: "/patient-dashboard", icon: Grid3X3, label: "Patient Dashboard" },
        { href: "/my-profile", icon: Settings, label: "My Profile" },
        ...(user.isAdmin ? [{ href: "/admin", icon: ClipboardList, label: "Admin Dashboard" }] : []),
    ]

    const formatName = (firstName: string = '', lastName: string = '') => {
        const fullName = `${firstName} ${lastName}`.trim()
        if (fullName.length <= 20) return fullName
        return (
            <>
                {firstName}
                {lastName && (
                    <>
                        <wbr />-<br />
                        {lastName}
                    </>
                )}
            </>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="sm:max-w-md">
                <ScrollArea className="h-full pr-4">
                    <Card
                        className="w-full max-w-4xl mx-auto relative z-10"
                        backgroundOpacity={0}
                        borderColor="border-orange-500"
                        borderSize={1}
                        shadowSize="md"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <Avatar user={user} className="w-12 h-12"/>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold truncate text-darkBlue">
                                        {user.accountType}
                                    </h2>
                                    <p className="text-xs text-orange-950 truncate">{formatName(user.firstName, user.lastName)}</p>
                                    <p className="text-xs text-orange-800">{user.email}</p>
                                    <p className="text-xs text-orange-700">{user.googleEmail}</p>
                                </div>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="languages">
                                    <AccordionTrigger>Languages</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.languages?.map((language, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white text-orange-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {language}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="countries">
                                    <AccordionTrigger>Countries</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.countries?.map((country, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white text-orange-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {country}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <nav className="space-y-2 mb-4 mt-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleItemClick}
                                className="w-full flex items-center justify-start p-2 text-sm rounded-md hover:bg-white hover:text-orange-500 transition-colors border-white border-2"
                            >
                                <item.icon className="mr-2 h-5 w-5 flex-shrink-0"/>
                                <span className="flex-grow text-center">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <Button
                        variant="orange"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                            signOut()
                            handleItemClick()
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4"/>
                        Sign Out
                    </Button>

                    {/* Footer Link */}
                    <div className="mt-12 text-center">
                        <Link
                            href="/new-patient"
                            className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                            onClick={handleItemClick}
                        >
                            New Patient
                        </Link>
                    </div>
                </ScrollArea>
            </SheetContent>

        </Sheet>
    )
}