// apps/web/app/auth/page.tsx
"use client";

import React, { useState } from "react";
import LoginForm from "./../../components/auth/LoginForm";
import { RadioCard } from "@/components/ui/radio-card";
import Flex from "./../../components/ui/flex";
import Text from "./../../components/ui/text";
import { SignupProvider } from "@/components/auth/signup/SignupContext";
import SignupSection from "./../../components/auth/signup/SignupSection";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

export default function AuthPage() {
    // Set initial state to 'Signup' instead of 'Login'
    const [authType, setAuthType] = useState<'Login' | 'Signup'>('Signup');
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

    const handleAuthTypeChange = (value: 'Login' | 'Signup') => {
        setAuthType(value);
        setIsHeaderVisible(value === 'Login');
    };

    const toggleHeader = () => {
        setIsHeaderVisible(!isHeaderVisible);
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            <div className="relative w-full md:w-[70vw] h-[70vh] bg-white rounded-lg shadow-md flex flex-col overflow-y-auto z-20 pointer-events-auto">
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isHeaderVisible ? "h-16" : "h-0 overflow-hidden"
                    }`}
                >
                    <div className="p-4 bg-gray-100 h-full">
                        <RadioCard.Root
                            value={authType}
                            onValueChange={handleAuthTypeChange}
                            className="flex w-full h-full"
                        >
                            <RadioCard.Item value="Login" className="w-1/2 p-2">
                                <Flex
                                    direction="column"
                                    width="100%"
                                    className="justify-center items-center h-full"
                                >
                                    <Text size="sm" weight="normal">Login</Text>
                                </Flex>
                            </RadioCard.Item>
                            <RadioCard.Item value="Signup" className="w-1/2 p-2">
                                <Flex
                                    direction="column"
                                    width="100%"
                                    className="justify-center items-center h-full"
                                >
                                    <Text size="sm" weight="normal">Sign Up</Text>
                                </Flex>
                            </RadioCard.Item>
                        </RadioCard.Root>
                    </div>
                </div>

                <button
                    onClick={toggleHeader}
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-full p-1 shadow-md"
                >
                    {isHeaderVisible ? (
                        <ChevronUpIcon size={24} />
                    ) : (
                        <ChevronDownIcon size={24} />
                    )}
                </button>

                <div className="flex-grow overflow-y-auto md:p-8 p-4">
                    {authType === "Login" ? (
                        <div className="login-card w-full flex flex-col items-center justify-center">
                            <LoginForm/>
                        </div>
                    ) : (
                        <SignupProvider>
                            <SignupSection/>
                        </SignupProvider>
                    )}
                </div>
            </div>
        </div>
    );
}