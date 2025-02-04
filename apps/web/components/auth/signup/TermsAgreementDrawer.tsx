// components/auth/signup/TermsAgreementDrawer.tsx
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import PrivacyPolicy from '@/components/auth/signup/0PrivacyPolicy';
import TermsOfService from '@/components/auth/signup/0TermsOfService';
import { useSignupContext } from './SignupContext';
import { Button } from "@/components/ui/button";

const TermsAgreementDrawer: React.FC = () => {
    const { agreedToTerms, setAgreedToTerms, isDrawerOpen, setIsDrawerOpen } = useSignupContext();

    const handleAgreementChange = (checked: boolean) => {
        setAgreedToTerms(checked);
    };

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);


    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={handleAgreementChange}
            />
            <Label
                htmlFor="terms"
                className="text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                I agree to the
                <Button
                    variant={'orangeOutline'}
                    type="button"
                    onClick={openDrawer}
                    className="ml-1 object-right mt-1"
                >
                    Terms of Service and Privacy Policy
                </Button>
            </Label>
            <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                <DrawerContent className="bg-orange-100" size="75%">
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible>
                            <AccordionItem className={'border-orange-500 border-2 mt-36'} value="terms">
                                <AccordionTrigger>Terms of Service</AccordionTrigger>
                                <AccordionContent>
                                    <TermsOfService />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className={'border-orange-500 border-2 mt-24'} value="privacy">
                                <AccordionTrigger>Privacy Policy</AccordionTrigger>
                                <AccordionContent>
                                    <PrivacyPolicy />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default TermsAgreementDrawer;