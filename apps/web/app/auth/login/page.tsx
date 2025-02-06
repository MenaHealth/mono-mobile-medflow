// app/auth/login/page.tsx

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ResetPasswordView from '@/components/form/forgotPassword/ResetPasswordView';
import { Drawer, DrawerContent, DrawerHeader, DrawerDescription } from '@/components/ui/drawer';
import {Button} from "@/components/ui/button";
import {AuroraBackground} from "@/components/ui/aurora-background";
import ForgotPasswordForm from "@/components/auth/forgotPassword/ForgotPasswordForm";
import {ExternalLink} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const privacyPolicyUrl = `${baseUrl}/auth/user-privacy-policy`;
const termsOfServiceUrl = `${baseUrl}/auth/user-terms-of-service`;

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resetCode = searchParams ? searchParams.get('code') : null;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (resetCode) {
            setIsOpen(true);
        }
    }, [resetCode]);

    const closeDrawer = () => {
        setIsOpen(false);
    };

    const handleSignupNavigation = () => {
        router.push('/auth/');
    };

    return (
        <AuroraBackground auroraStyle={'orange'}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="mb-12 text-center">
                        <p className="text-md text-darkBlue">
                            Do not have an account?{' '}
                            <Button
                                onClick={handleSignupNavigation}
                                variant={'default'}
                                className={'ml-4 hover:text-orange-200 hover:bg-orange-100 transition-colors'}
                            >
                                Sign up here
                            </Button>
                        </p>
                    </div>
                    <LoginForm/>
                    <div className={'mt-12'}>
                        <ForgotPasswordForm/>
                    </div>



                    <div className="flex justify-center space-x-4 text-xs mt-12">
                        <a
                            href={termsOfServiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-4 bg-white-500 rounded-md text-black hover:bg-orange-600 transition-all max-w-xs text-center shadow-md"
                        >
                            <p><i>View Doctor, Triage, and Evac </i><br/><u>Terms of Service</u></p>
                            <ExternalLink className="ml-1 w-4 h-4"/>
                        </a>
                        <a
                            href={privacyPolicyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-4 bg-white-500 rounded-md text-black hover:bg-orange-600 transition-all max-w-xs text-center shadow-md"
                        >
                            <p><i>View Doctor, Triage, and Evac</i> <u>Privacy Policy<br/></u><br/></p>
                            <ExternalLink className="ml-1 w-4 h-4"/>
                        </a>
                    </div>

                </div>
                <Drawer
                    isOpen={isOpen}
                    onClose={closeDrawer}
                >
                    <DrawerContent
                        direction="bottom"
                        size="70%"
                        title="Reset Password"
                    >
                        <DrawerHeader>
                            <DrawerDescription>Enter your new password below.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                            {resetCode && <ResetPasswordView code={resetCode} onSuccess={closeDrawer}/>}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </AuroraBackground>
    );
}
