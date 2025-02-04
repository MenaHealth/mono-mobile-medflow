// components/auth/signup/SignupContext.tsx
import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

interface FormData {
    accountType?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    securityQuestions?: { question: string; answer: string }[];
    firstName?: string;
    lastName?: string;
    dob?: string;
    doctorSpecialty?: string[];
    languages?: string[];
    gender?: 'Male' | 'Female' | undefined;
    countries?: string[];
    question1?: string;
    answer1?: string;
    question2?: string;
    answer2?: string;
    question3?: string;
    answer3?: string;
}

interface SignupContextValue {
    // next/back button, progress bar, and form completion
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    progress: number;
    updateProgress: () => void;
    handleNext: () => void;
    handleBack: () => void;
    answeredQuestions: number;
    setAnsweredQuestions: (count: number) => void;
    updateAnsweredQuestions: (step: number, count: number) => void;
    stepAnswers: number[];
    // userTypeForm
    accountType: 'Doctor' | 'Triage' | 'Evac' | null;
    setAccountType: React.Dispatch<React.SetStateAction<'Doctor' | 'Triage' | 'Evac' | null>>;
    //PasswordEmailForm
    validEmail: boolean;
    setValidEmail: React.Dispatch<React.SetStateAction<boolean>>;
    emailExists: boolean;
    setEmailExists: React.Dispatch<React.SetStateAction<boolean>>;
    passwordsMatch: boolean;
    setPasswordsMatch: React.Dispatch<React.SetStateAction<boolean>>;
    agreedToTerms: boolean;
    setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // SecurityQuestionsForm
    securityQuestionFormCompleted: boolean;
    setSecurityQuestionFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    // DoctorSignupForm
    doctorSignupFormCompleted: boolean;
    setDoctorSignupFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    // TriageSignupForm
    triageSignupFormCompleted: boolean;
    setTriageSignupFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    //EvacSignup
    evacSignupFormCompleted: boolean;
    setEvacSignupFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export const useSignupContext = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignupContext must be used within a SignupProvider');
    }
    return context;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage' | 'Evac' | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [stepAnswers, setStepAnswers] = useState<number[]>(new Array(4).fill(0));
    // step 1: user type selection, step 2: email password, step 3: security questions, step 4: doctor / triage sign up
    const [validEmail, setValidEmail] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [securityQuestionFormCompleted, setSecurityQuestionFormCompleted] = useState(false);
    const [doctorSignupFormCompleted, setDoctorSignupFormCompleted] = useState(false);
    const [triageSignupFormCompleted, setTriageSignupFormCompleted] = useState(false);
    const [evacSignupFormCompleted, setEvacSignupFormCompleted] = useState(false);


    const totalQuestions = useMemo(() => {
        switch (accountType) {
            case 'Doctor':
                return 18;
            case 'Triage':
                return 14;
            case 'Evac':
                return 14;
            default:
                return 4; // For the initial user type selection and email/password step
        }
    }, [accountType]);

    const updateProgress = useCallback(() => {
        const newProgress = (answeredQuestions / totalQuestions) * 100;// Log for debugging
        setProgress(newProgress);
    }, [answeredQuestions, totalQuestions]);

    const updateAnsweredQuestions = useCallback((step: number, count: number) => {
        if (count < 0 || step >= stepAnswers.length) {
            console.warn(`Invalid step: ${step} or count: ${count}`);
            return;
        }

        setStepAnswers((prev) => {
            const newStepAnswers = [...prev];
            if (newStepAnswers[step] !== count) {
                newStepAnswers[step] = count;
                const termsAgreementCount = agreedToTerms ? 1 : 0;
                const newTotal = newStepAnswers.reduce((acc, curr) => acc + curr, 0) + termsAgreementCount;
                setAnsweredQuestions(newTotal);
                return newStepAnswers;
            }
            return prev;
        });
    }, [stepAnswers, agreedToTerms]);

    useEffect(() => {
        const termsAgreementCount = agreedToTerms ? 1 : 0;
        setAnsweredQuestions((prev) => {
            const newTotal = stepAnswers.reduce((acc, curr) => acc + curr, 0) + termsAgreementCount;
            return newTotal !== prev ? newTotal : prev;
        });
    }, [agreedToTerms, stepAnswers]);

    useEffect(() => {
        console.log('Updating progress based on answered questions or total questions');
        updateProgress();
    }, [answeredQuestions, totalQuestions, updateProgress]);

    const handleNext = useCallback(() => {
        if (currentStep === 1 && emailExists) {
            return;
        }
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, emailExists]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    return (
        <SignupContext.Provider
            value={{
                formData,
                setFormData,
                currentStep,
                setCurrentStep,
                progress,
                updateProgress,
                handleNext,
                handleBack,
                answeredQuestions,
                setAnsweredQuestions,
                updateAnsweredQuestions,
                stepAnswers,

                accountType,
                setAccountType,

                validEmail,
                setValidEmail,
                emailExists,
                setEmailExists,
                passwordsMatch,
                setPasswordsMatch,
                agreedToTerms,
                setAgreedToTerms,
                isDrawerOpen,
                setIsDrawerOpen,

                securityQuestionFormCompleted,
                setSecurityQuestionFormCompleted,
                doctorSignupFormCompleted,
                setDoctorSignupFormCompleted,
                triageSignupFormCompleted,
                setTriageSignupFormCompleted,
                evacSignupFormCompleted,
                setEvacSignupFormCompleted,
            }}
        >
            {children}
        </SignupContext.Provider>
    );
};

export { SignupContext };