// components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ForgotPasswordProvider, useForgotPasswordContext } from './ForgotPasswordContext';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const EmailStep = dynamic(() => import('./EmailStep'), { ssr: false });
const VerificationStep = dynamic(() => import('./VerificationStep'), { ssr: false });
const SecurityQuestionStep = dynamic(() => import('./SecurityQuestionStep'), { ssr: false });
const ResetPasswordStep = dynamic(() => import('./ResetPasswordStep'), { ssr: false });
const ResetPasswordSuccessStep = dynamic(() => import('./ResetPasswordSuccessStep'), { ssr: false });

function ForgotPasswordFormContent() {
    const { step, handleNextStep, form } = useForgotPasswordContext();

    return (
        <FormProvider {...form}>
            <div className="w-full max-w-md space-y-4">
                {step === 1 && <EmailStep onNext={handleNextStep} />}
                {step === 2 && <VerificationStep onNext={handleNextStep} />}
                {step === 3 && <SecurityQuestionStep onNext={handleNextStep} />}
                {step === 4 && <ResetPasswordStep />}
                {step === 5 && <ResetPasswordSuccessStep />}
            </div>
        </FormProvider>
    );
}

export function ForgotPasswordForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DrawerTrigger asChild>
                <Button variant="link" onClick={() => setIsOpen(true)}>
                    Forgot Password?
                </Button>
            </DrawerTrigger>
            <DrawerContent direction="bottom" size="75%" title="Forgot Password">
                <ForgotPasswordProvider>
                    <ForgotPasswordFormContent />
                </ForgotPasswordProvider>
            </DrawerContent>
        </Drawer>
    );
}

export default ForgotPasswordForm;

