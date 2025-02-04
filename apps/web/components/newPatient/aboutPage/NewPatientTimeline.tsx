// components/newPatient/aboutPage/NewPatientTimeline.tsx
"use client"

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useTransform, useInView, useAnimation, useScroll } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { ContainerScroll } from "./container-scroll-animation";
import Image from "next/image";
import { Spotlight } from "@/components/newPatient/aboutPage/Spotlight";
import StepItem from "./StepItem";
import { newPatientTranslations, TranslationContent } from "./NewPatientTranslations";
import LanguageDropdown from "@/components/newPatient/aboutPage/LanguageDropdown";
import AnimatedLogo from "@/components/newPatient/aboutPage/AnimatedLogo";

interface NewPatientWithTimelineProps {
    initialLanguage: 'english' | 'arabic' | 'pashto' | 'farsi';
}

export default function NewPatientTimeline({ initialLanguage }: NewPatientWithTimelineProps) {
    const [language, setLanguage] = useState<'english' | 'arabic' | 'pashto' | 'farsi'>(initialLanguage);
    const content: TranslationContent = newPatientTranslations[language];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [containerHeight, setContainerHeight] = useState(0);
    const controls = useAnimation();
    const stepsRef = useRef(null);
    const isStepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

    const getStartedRef = useRef(null);
    const spotlightRef = useRef(null);
    const isSpotlightInView = useInView(spotlightRef, { once: true, amount: 0.3 });

    const lineHeight = useTransform(scrollYProgress, [0, 1], [0, containerHeight]);

    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        if (isStepsInView) {
            controls.start("visible");
        }
    }, [isStepsInView, controls]);

    const isRTL = language !== 'english';

    const renderedSteps = useMemo(() => {
        return content.steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} controls={controls} isRTL={isRTL} />
        ));
    }, [content.steps, controls, isRTL]);

    return (
        <div ref={containerRef} className={`relative max-w-5xl mx-auto p-6 overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Translation Button */}
            <div className="absolute top-16 items-center object-center text-center z-20">
                <LanguageDropdown
                    currentLanguage={language}
                    onLanguageChange={setLanguage}
                />
            </div>

            {/* Timeline Line */}
            {isStepsInView && (
                <div className={`absolute ${isRTL ? 'right-6 mr-4' : 'left-6 ml-4'} top-0 bottom-0 w-0.5`}>
                    <motion.div
                        className="w-full h-full"
                        style={{
                            height: lineHeight,
                            background: "linear-gradient(to bottom, white, #056E73)",
                            transformOrigin: "top"
                        }}
                    />
                </div>
            )}

            <div className="flex justify-center mb-8">
                <AnimatedLogo/>
            </div>

            {/* Title */}
            <motion.h1
                className="text-2xl text-green-700 font-bold text-center mb-4 pb-24 relative z-10 -mr-10 -ml-10"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
            >
                {content.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.div
                className={`text-darkBlue pb-12 relative z-10 border-orange-500 ${isRTL ? 'text-right pl-4 mr-4 border-r-2 ml-4 pr-8' : 'text-left pr-4 ml-4 border-l-2 pl-8'}`}
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
            >
                <p>
                    {content.subtitlePart1}{' '}
                    <span className="text-orange-500 font-bold">{content.subtitlePart2}</span>{' '}
                    {content.subtitlePart3}
                </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-6 mt-12 relative z-10 max-w-2xl mx-auto" ref={stepsRef}>
                {renderedSteps}
            </div>
            {/* Spotlight */}
            <div ref={spotlightRef} className="absolute top-0 right-0 w-full h-[100vh] -mt-48">
                <Spotlight className="z-0" fill="#ff5722" isInView={isSpotlightInView}/>
            </div>

            {/* Get Started Section with Spotlight */}
            <div className="my-16 relative overflow-hidden" ref={getStartedRef}>

                <motion.div
                    className="relative z-10 text-center"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 1.2, ease: "easeOut"}}
                >
                    <a
                        href={content.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#056E73] text-white font-bold py-2 px-6 rounded transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <FiSend className={isRTL ? 'ml-2' : 'mr-2'}/>
                        <span>{content.buttonText}</span>
                    </a>
                </motion.div>

                {/* Get Started Content */}
                <ContainerScroll
                    titleComponent={
                        <h2 className="text-2xl font-semibold relative z-10">{content.getStarted}</h2>
                    }
                >
                    <div className="relative z-10 bg-opacity-80 p-6 rounded-lg">
                        <Image
                            src="/assets/images/telegram-chat.svg"
                            alt="Telegram Chat"
                            width={600}
                            height={600}
                            className="mx-auto object-contain w-full h-auto"
                        />
                    </div>
                </ContainerScroll>
            </div>

            {/* Map Image Section */}
            <div className="relative mt-4">
                <div className="absolute inset-0 z-0 flex justify-center items-center translate-y-16">
                    <Image
                        src="/assets/images/map.png"
                        alt="Map"
                        width={800}
                        height={600}
                        className="w-2/3 opacity-20"
                    />
                </div>
            </div>

            {/* Help Section */}
            <motion.div
                className="mt-8 text-center relative z-10"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8, delay: 1.5, ease: "easeOut"}}
            >
                <h3 className="text-lg font-semibold mt-48 text-gray-800">{content.helpText}</h3>
                <p className="text-sm text-gray-600 mr-12 ml-12">{content.contactInfo}</p>
            </motion.div>
        </div>
    );
}

