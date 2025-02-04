// apps/web/app/about/page.tsx
'use client';

import { motion } from "framer-motion"
import React, { useEffect } from 'react';
import { Card } from '/components/ui/card';
import './aboutPage.css';
import { ClipboardList, ClipboardPlus, Calendar, Image, Stethoscope, FileText, ExternalLink } from 'lucide-react';
import {DoctorSpecialtiesDialog} from "../../components/aboutPage/DoctorSpecialtiesDialog";
import {CountriesDialog} from "../../components/aboutPage/CountriesServedDialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import {AnimatedBackgroundCircle} from "../../components/aboutPage/AnimatedBackgroundCirlce";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const privacyPolicyUrl = `${baseUrl}/auth/user-privacy-policy`;
const termsOfServiceUrl = `${baseUrl}/auth/user-terms-of-service`;

const features = [
    { icon: ClipboardList, title: "View Patient Info", description: "Access comprehensive patient information" },
    { icon: Calendar, title: "Schedule Lab Visits", description: "Easily manage and schedule laboratory appointments" },
    { icon: Stethoscope, title: "Take Patient Notes", description: "Record detailed medical notes for each patient" },
    { icon: Image, title: "Image Gallery", description: "Maintain a dedicated image gallery for each patient" },
    { icon: FileText, title: "Prescription Management", description: "Generate and manage drug prescription paperwork" },
];

export default function AboutPage() {
    useEffect(() => {
        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animateCountUp = (elementId, target, duration) => {
                        const element = document.getElementById(elementId);
                        if (!element) return;

                        const start = 0;
                        const increment = Math.ceil(target / (duration / 50));
                        let current = start;

                        const updateCounter = () => {
                            current += increment;
                            if (current > target) current = target;
                            element.innerText = current;

                            if (current < target) {
                                setTimeout(updateCounter, 50);
                            }
                        };

                        updateCounter();
                    };

                    animateCountUp('counter-physicians', 200, 2000);
                    animateCountUp('counter-countries', 10, 2000);
                    animateCountUp('counter-specialties', 30, 2000);

                    observer.disconnect();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.3 });
        const target = document.getElementById('statistics-section');
        if (target) {
            observer.observe(target);
        }
    }, []);

    const teamMembers = [
        {
            name: "Michelle",
            image: "assets/images/mn1_hdst.png",
            title1: "Founder / CEO MENA Health",
            title2: "Co-Founder / Project Lead Medflow"
        },
        {
            name: "Maya",
            image: "assets/images/ma_hdst.jpeg",
            title1: "Chief Development Officer MENA Health",
            title2: "Co-Founder Medflow"
        },
        {
            name: "Kyle",
            image: "assets/images/ke_hdst.jpg",
            title1: "Co-Founder Medflow",
            title2: ""
        },
        {
            name: "Andy",
            image: "assets/images/ac_hdst.jpg",
            title1: "Co-Founder Medflow",
            title2: ""
        }
    ];

    return (
        <div className="min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-[url('/assets/images/grid.svg')] bg-repeat opacity-35"
                    style={{
                        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                    }}
                />
            </div>
            <AnimatedBackgroundCircle/>
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-40">
                <div className="text-center mb-16">
                    <h1 className="pt-60 z-20 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ">
                        First Virtual Hospital
                    </h1>
                    <h2 className="z-10 mt-6 mb-6 text-darkBlue w-1/2 mx-auto flex items-center justify-center text-center text-2xl">
                        <i><b>for the MENA Region</b></i>
                    </h2>
                    <p className="text-center pt-96 max-w-md mx-auto text-base text-darkBlue sm:text-lg md:text-xl md:max-w-3xl">
                        MedFlow connects a global network of volunteer doctors to support on-the-ground healthcare
                        facilities under crisis. <i>It empowers online triage management, telehealth, and prescription
                        management</i> to optimize urgent treatment, giving displaced civilians control over their
                        medical histories and <b>ensuring physicians have the autonomy to provide informed care — no
                        matter where they are.</b></p>
                </div>
            </div>

            {/* Animation Section */}
            <div className="card-animation">
                <div className="ball-connection ball1-connection"></div>
                <div className="ball-connection ball2-connection"></div>
                <div className="ball-connection ball3-connection"></div>
                <div className="ball-connection ball4-connection"></div>
                <div className="ball-connection ball5-connection"></div>
            </div>

            {/* Statistics Section */}
            <div
                id="statistics-section"
                className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
                style={{
                    columnGap: "0px",
                    maxWidth: "80%",
                    margin: "0 auto",
                }}
            >
                <div className={'z-10'}>
                    <h2 className="text-6xl font-bold text-[var(--orange)]">
                        <span id="counter-physicians">0</span>+
                    </h2>
                    <p className="mt-2 text-lg text-darkBlue ">Onboarded Physicians</p>
                </div>
                <div className={'z-10'}>
                    <h2 className="text-6xl font-bold text-[var(--orange)]">
                        <span id="counter-specialties">0</span>+
                    </h2>
                    <p className="mt-2 text-lg text-darkBlue">Specialties Offered</p>
                    <DoctorSpecialtiesDialog/>
                </div>
                <div className={'z-10'}>
                    <h2 className="text-6xl font-bold text-[var(--orange)]">
                        <span id="counter-countries">0</span>
                    </h2>
                    <p className="mt-2 text-lg text-darkBlue">Countries of Interest</p>
                    <CountriesDialog/>
                </div>
            </div>

            {/* Team Section */}


            <div className="min-h-screen pt-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
                            How it Works:
                        </h1>
                    </div>

                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-4">
                            <Card className="p-6 bg-white bg-opacity-30 card-container">
                                {/* Patients card content */}
                                <div className="card-header">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-md bg-orange text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="#7f190f"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-orange-900 text-center">Patients</h3>
                                <motion.div className="card-animation">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <motion.div
                                            key={i}
                                            className={`ball-first ball${i}-first`}
                                            animate={{
                                                y: [0, -10, 0],
                                                transition: {
                                                    duration: 1.5,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    delay: i * 0.2,
                                                },
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                <div className="card-content">
                                    <p className="mt-2 text-base text-darkBlue">
                                        Patients sign up via messaging our telegram bot or a member of our staff can add
                                        them in.
                                    </p>
                                </div>
                            </Card>

                            <Card className="p-6 bg-white bg-opacity-60 card-container">
                                {/* Triage Specialists card content */}
                                <div className="card-header">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-md bg-yellow text-darkBlue">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="#c71e07"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-orange-700 text-center">Triage Coordinators</h3>
                                <motion.div className="card-animation">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            className={`ball ball${i}`}
                                            animate={{
                                                x: [0, 10, 0],
                                                y: [0, -5, 0],
                                                transition: {
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    delay: i * 0.3,
                                                },
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                <div className="card-content">
                                    <p className="mt-2 text-base text-darkBlue">
                                        Triage coordinators oversea the patients after intake forms are processed and
                                        assign patients a doctor
                                        speciality based on the <i>chief concern</i> provided.
                                    </p>
                                </div>
                            </Card>

                            <Card
                                className="p-6 bg-white bg-opacity-100 card-container md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0">
                                {/* Doctors card content */}
                                <div className="card-header">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-md bg-orange text-white">
                                        <ClipboardPlus className="text-orange-300 w-6 h-6"/>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-black text-center">Doctors</h3>
                                <div className="card-animation">
                                    <div className="heart-rate">
                                        <svg viewBox="0 9 498.778 54.805" className="w-full h-full">
                                            <polyline fill="none" stroke="var(--lightOrange)" strokeWidth="2"
                                                      strokeMiterlimit="10"
                                                      points="0 45.486 64.133 45.486 74.259 33.324 84.385 45.486 96.2 45.486 104.637 55.622 119.825 9 133.327 63.729 140.079 45.486 162.018 45.486 172.146 40.419 183.958 45.486 249.778 45.486"/>
                                            <polyline fill="none" stroke="var(--lightOrange)" strokeWidth="2"
                                                      strokeMiterlimit="10"
                                                      points="249 45.562 313.133 45.562 323.259 33.4 333.385 45.562 345.2 45.562 353.637 55.698 368.825 9.076 382.327 63.805 389.079 45.562 411.018 45.562 421.146 40.495 432.958 45.562 498.778 45.562"/>
                                        </svg>
                                        <div className="fade-in"></div>
                                        <div className="fade-out"></div>
                                    </div>
                                </div>
                                <div className="card-content flex items-start">
                                    <p className="mt-2 text-base text-darkBlue flex-grow">
                                        Doctors with various specializations are authorized and scheduled by triage
                                        coordinators
                                        based on patient needs and location.
                                    </p>
                                    <DoctorSpecialtiesDialog/>
                                </div>
                            </Card>
                        </div>
                    </div>


                    <h1 className="mt-24 font-bold tracking-tight text-black text-2xl">
                        Patient Order of Operations:
                    </h1>
                    <div className="mt-12 min-w-64 max-w-fit mx-auto flex items-center justify-center text-cente">
                        <div className="bg-gradient-to-b from-orange-100 to-white bg p-4 rounded-md">


                            <div className="space-y-8">
                                <div className="space-y-6">
                                    {[
                                        {
                                            title: "To begin, patients message the bot /start",
                                            description: "and the bot will prompt them for their language"
                                        },
                                        {
                                            title: "Once the patient language is provided the bot responds with a individualized intake URL; ",
                                            description: "and the patient is saved in our database, however, their will be no info attached to the patient until they complete the intake URL "
                                        },
                                        {
                                            title: "Triage coordinator analyze patient information provided.",
                                            description: "To match patients with doctors in the correct medical specialty based on the patient-provided doctor-gender preferences, language spoken, and location."
                                        },
                                        {
                                            title: "Doctors will see a modular spreadsheet individualized to them with patient's that match their specialty / language / locations",
                                            description: "Doctors select patients and once selected the patient is not viewable by other doctors"
                                        },
                                        {
                                            title: "Doctors can speak with the patient through the Telegram Bot and prescribe medications",
                                            description: "Patients and Dcotors can exchange voice notes and photo's. Doctors can send Rx orders to patients with individualized QR codes that patients can take to pharmacies to fulfill their order."
                                        },
                                        {
                                            title: "Pharmacists scan the QR codes on the Doctor Provided Rx Orders",
                                            description: "They enter in their contact information and if they provided the full perscription, some of it, and if it was completed the Rx Order will no longer be accessible to scan again till the Doctor provides a new script"
                                        }
                                    ].map((step, index) => (
                                        <div key={index} className="flex items-start space-x-6">
                                            <div
                                                className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--orange)] flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                                <p className="text-sm text-gray-800">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-r-0 border-l-0 border-orange-500 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Multilingual support for broader accessibility</li>
                                        <li>Secure handling of patient information</li>
                                        <li>Efficient triage system for prompt care</li>
                                        <li>Remote consultations with qualified doctors</li>
                                    </ul>
                                </div>

                                <p className="text-sm text-gray-600 italic">
                                    Our streamlined process ensures that patients receive appropriate care
                                    efficiently,
                                    bridging geographical gaps in healthcare access.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="mt-24 font-bold tracking-tight text-black text-2xl">
                        Available functionality for Doctors:
                    </h2>

                    <div className="mt-12 min-w-64 max-w-fit mx-auto flex items-center justify-center text-cente">
                        <div className="bg p-4 rounded-md border-t-2 border-b-2 border-orange-500">
                            <p className="text-lg text-darkBlue mb-6">Once a patient is directed to a doctors
                                specialization, our platform offers:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <feature.icon
                                            className="w-6 h-6 text-[var(--orange)] flex-shrink-0 mt-1"/>
                                        <div>
                                            <h3 className="font-semibold text-black">{feature.title}</h3>
                                            <p className="text-sm text-darkBlue">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 mt-8 md:mt-0 md:ml-8">
                        </div>
                    </div>

                    <div
                        className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-2 border-orange-500 hover:bg-orange-50 rounded-md mr-2 ml-2 transition-colors">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="founding-team">
                                <AccordionTrigger className="text-2xl text-orange-500 font-bold text-center">
                                    Founding Team
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div
                                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-4">
                                        {teamMembers.map((member, index) => (
                                            <Card key={index} className="p-2 bg-white bg-opacity-30 card-container">
                                                <div className="flex flex-col items-center text-center">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="rounded-full object-cover w-20 h-20 mb-4"
                                                    />
                                                    <h3 className="text-lg font-medium text-black">{member.name}</h3>
                                                    <h3 className="text-sm text-[var(--orange)] italic">{member.title1}</h3>
                                                    {member.title2 && (
                                                        <h3 className="text-xs text-[var(--orange)] italic">{member.title2}</h3>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>


                    <div className="flex justify-center space-x-4 text-sm pt-12">
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
            </div>
        </div>
    )
}

