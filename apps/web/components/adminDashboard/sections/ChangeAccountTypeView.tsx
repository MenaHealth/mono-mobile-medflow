// components/auth/adminDashboard/sections/ChangeAccountTypeView.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { Card, CardContent } from "@/components/ui/card";

type AccountType = 'Doctor' | 'Triage' | 'Evac';

interface ChangeAccountTypeViewProps {
    onClose?: () => void;
    isDialog?: boolean;
}

export default function ChangeAccountTypeView({ onClose, isDialog = false }: ChangeAccountTypeViewProps) {
    const { data: session, update } = useSession();
    const [accountType, setAccountType] = useState<AccountType | undefined>(session?.user?.accountType as AccountType);
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAccountType(session?.user?.accountType as AccountType);
    }, [session?.user?.accountType]);

    useEffect(() => {
        if (isDialog) {
            function handleClickOutside(event: MouseEvent) {
                if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                    onClose?.();
                }
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [onClose, isDialog]);

    const handleTypeChange = async (newType: AccountType) => {
        if (!session?.user?._id || newType === accountType) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/${session.user._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ accountType: newType }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to update account type');
            }

            const updatedUser = await response.json();

            await update({
                ...session,
                user: { ...session.user, accountType: updatedUser.accountType }
            });

            setAccountType(updatedUser.accountType as AccountType);
            onClose?.();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update account type. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const content = (
        <div className={isDialog ? "space-y-2 p-2" : "container mx-auto px-4"}>
            {!isDialog && (
                <div className="flex justify-end mb-12">
                    <Button
                        variant="outline"
                        onClick={() => handleTypeChange(accountType as AccountType)}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            )}
            <div className={`flex ${isDialog ? 'flex-col' : 'flex-wrap justify-center'} items-center mb-4 gap-4`}>
                {(['Triage', 'Doctor', 'Evac'] as const).map((type) => (
                    <Button
                        key={type}
                        variant={accountType === type ? 'default' : 'submit'}
                        className={isDialog ? "w-full justify-start text-sm" : ""}
                        style={!isDialog ? { transform: 'scale(1.5)', margin: '0 2.5rem' } : {}}
                        onClick={() => isDialog ? handleTypeChange(type) : setAccountType(type)}
                        disabled={isLoading}
                    >
                        {type}
                    </Button>
                ))}
            </div>
            {!isDialog && (
                <>
                    <div>Current account type: {accountType}</div>
                    <div>Session account type: {session?.user?.accountType}</div>
                </>
            )}
        </div>
    );

    if (isDialog) {
        return (
            <Card
                ref={cardRef}
                className="w-48 overflow-hidden"
                backgroundColor="bg-white"
                backgroundOpacity={90}
                blurAmount={24}
                borderColor="border-white"
                borderSize={1}
                shadowSize="lg"
            >
                <CardContent className="p-4">
                    {content}
                </CardContent>
            </Card>
        );
    }

    return content;
}


