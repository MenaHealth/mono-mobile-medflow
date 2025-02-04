// components/patientViewModels/Medications/MedicationsView.tsx

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { RadioCard } from '@/components/ui/radio-card';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from '@/components/patientViewModels/Medications/med/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import RxOrderDrawerView from './rx/RxOrderDrawerView';
import { usePatientDashboard } from '@/components/patientViewModels/PatientViewModelContext';
import { BarLoader } from "react-spinners";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";
import { ChevronDown, ChevronUp, Share } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { IRxOrder } from '@/models/patient';
import { IMedOrder } from '@/models/medOrder';
import {Types} from "mongoose";
import { useSession } from 'next-auth/react';
import {AnimatePresence, motion } from 'framer-motion';

interface MedicationsViewProps {
    patientId: string | Types.ObjectId;

}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const { data: session } = useSession();
    const {
        rxOrders,
        medOrders,
        loadingMedications,
        refreshMedications,
    } = usePatientDashboard();
    const handleScreenResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    useEffect(() => {
        handleScreenResize();
        window.addEventListener('resize', handleScreenResize);
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        };
    }, []);

    const [isValidPatientId, setIsValidPatientId] = useState(false);

    useEffect(() => {
        refreshMedications();
    }, [refreshMedications]);

    const {
        patientInfo,
        addRxOrder,
    } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medOrder'>('rxOrder');
    const [isMobile, setIsMobile] = useState(false);
    const [showAllMedications, setShowAllMedications] = useState(false);
    const [isLatestExpanded, setIsLatestExpanded] = useState(false);
    const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);

    const handleOpenShareDrawer = (rxOrder: IRxOrder) => {
        setSelectedRxOrder(rxOrder);
        setIsShareDrawerOpen(true);
    };

    const methods = useForm({
        defaultValues: {
            rxOrders: rxOrders || [],
            medOrders: medOrders || [],
        },
    });



    const allMedications = React.useMemo(() => {
        return [...rxOrders, ...medOrders].sort((a, b) => {
            const dateA = new Date("prescribedDate" in a ? a.prescribedDate : a.orderDate);
            const dateB = new Date("prescribedDate" in b ? b.prescribedDate : b.orderDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [rxOrders, medOrders]);




    const latestMedication = allMedications[0] || {
        prescriptions: [],
        medications: [],
        city: 'Unknown',
        patientCity: 'Unknown',
        validTill: null,
    };
    const formatDateTime = (date: Date) => {
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };


    const isRxOrder = latestMedication && 'prescriptions' in latestMedication;

    const handleValueChange = (value: 'rxOrder' | 'medOrder') => {
        if (value !== templateType) {
            setTemplateType(value);
            methods.reset({
                rxOrders: value === 'rxOrder' ? rxOrders : [],
                medOrders: value === 'medOrder' ? medOrders : [],
            });
        }
    };

    const toggleAllMedications = (event: React.MouseEvent) => {
        event.preventDefault();
        setShowAllMedications(!showAllMedications);
    };

    const toggleLatestExpanded = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsLatestExpanded(!isLatestExpanded);
    };

    if (loadingMedications) {
        return (
            <div className="flex items-center justify-center h-[100vh] text-white bg-orange-950" aria-live="polite">
                <BarLoader color="#ffffff" />
                <span className="sr-only">Loading medications...</span>
            </div>
        );
    }

    const isDoctor = session?.user?.accountType === 'Doctor';
    const isTriage = session?.user?.accountType === 'Triage';
    const isEvac = session?.user?.accountType === 'Evac';


    return (
        <FormProvider {...methods}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-[100vh] overflow-hidden bg-orange-950"
            >
                <div className="flex-grow overflow-auto border-t-2 border-white rounded-lg">
                    {!isTriage && latestMedication && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="p-4 border-b border-white rounded-lg"
                        >
                            <div className="text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <motion.button
                                            onClick={toggleLatestExpanded}
                                            className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                                            aria-expanded={isLatestExpanded}
                                            type="button"
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.9}}
                                        >
                                            {isLatestExpanded ? <ChevronUp className="h-5 w-5"/> :
                                                <ChevronDown className="h-5 w-5"/>}
                                        </motion.button>
                                        <div className="inline-block p-2 mb-2">Latest:</div>
                                        <div className="text-center bg-white border-2 p-2 text-orange-950">
                                            {isRxOrder ? "Medication Prescription Referral" : "Request for Unavailable Medications"}
                                        </div>
                                    </div>
                                    {isRxOrder && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenShareDrawer(latestMedication as IRxOrder)}
                                        >
                                            <Share/>
                                            <span className="sr-only">Share Medication Prescription Referral</span>
                                        </Button>
                                    )}
                                </div>
                                <p className={'text-right'}>
                                    {formatDateTime(new Date(isRxOrder ? latestMedication.prescribedDate : latestMedication.orderDate))}
                                </p>
                                <p className="mt-2 text-center"><i>{latestMedication.doctorSpecialty}</i></p>
                                <p className="text-left">Dr. <b>{latestMedication.prescribingDr}</b></p>

                                <AnimatePresence>
                                    {isLatestExpanded && (
                                        <motion.div
                                            initial={{opacity: 0, height: 0}}
                                            animate={{opacity: 1, height: "auto"}}
                                            exit={{opacity: 0, height: 0}}
                                            transition={{duration: 0.3}}
                                            className="mt-2 p-2 bg-white text-darkBlue rounded-sm overflow-hidden"
                                        >
                                            <p>
                                                <strong>City:</strong>{" "}
                                                {isRxOrder ? latestMedication?.city : latestMedication?.patientCity || "Unknown"}
                                            </p>
                                            {isRxOrder && (
                                                <p>
                                                    <strong>Valid Till:</strong>{" "}
                                                    {latestMedication?.validTill
                                                        ? new Date(latestMedication.validTill).toLocaleDateString()
                                                        : "Not Available"}
                                                </p>
                                            )}
                                            <h4 className="mt-2 font-bold">{isRxOrder ? "Prescriptions:" : "Medications:"}</h4>
                                            {isRxOrder ? (
                                                latestMedication?.prescriptions?.length > 0 ? (
                                                    latestMedication.prescriptions.map((med, medIndex) => (
                                                        <motion.div
                                                            key={`latest-med-${medIndex}`}
                                                            initial={{opacity: 0, y: -10}}
                                                            animate={{opacity: 1, y: 0}}
                                                            transition={{duration: 0.2, delay: medIndex * 0.1}}
                                                            className="mt-2 p-2 bg-gray-100 rounded-sm"
                                                        >
                                                            <p>
                                                                <strong>Diagnosis:</strong> {med.diagnosis || "N/A"}
                                                            </p>
                                                            <p>
                                                                <strong>Medication:</strong> {med.medication || "N/A"}
                                                            </p>
                                                            <p>
                                                                <strong>Dosage:</strong> {med.dosage || "N/A"}
                                                            </p>
                                                            <p>
                                                                <strong>Frequency:</strong> {med.frequency || "N/A"}
                                                            </p>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <p>No prescriptions available.</p>
                                                )
                                            ) : latestMedication?.medications?.length ? (
                                                latestMedication.medications.map((med, medIndex) => (
                                                    <motion.div
                                                        key={`latest-med-${medIndex}`}
                                                        initial={{opacity: 0, y: -10}}
                                                        animate={{opacity: 1, y: 0}}
                                                        transition={{duration: 0.2, delay: medIndex * 0.1}}
                                                        className="mt-2 p-2 bg-gray-100 rounded-sm"
                                                    >
                                                        <p>
                                                            <strong>Diagnosis:</strong> {med.diagnosis || "N/A"}
                                                        </p>
                                                        <p>
                                                            <strong>Medication:</strong> {med.medication || "N/A"}
                                                        </p>
                                                        <p>
                                                            <strong>Dosage:</strong> {med.dosage || "N/A"}
                                                        </p>
                                                        <p>
                                                            <strong>Frequency:</strong> {med.frequency || "N/A"}
                                                        </p>
                                                        <p>
                                                            <strong>Quantity:</strong> {med.quantity || "N/A"}
                                                        </p>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <p>No medications available.</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {!isTriage && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="sticky bottom-0 w-full p-4 bg-orange-950 border-t border-white/10"
                        >
                            <Button
                                variant="outline"
                                className="w-full bg-white text-orange-950 border-white hover:bg-orange-800 hover:text-white border-2 transition-colors pt-4 pb-4"
                                onClick={toggleAllMedications}
                                type="button"
                            >
                                {showAllMedications ? (
                                    <>
                                        <ChevronUp className="mr-2 h-4 w-4" />
                                        Hide previous medications
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="mr-2 h-4 w-4" />
                                        All previous medications
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {showAllMedications && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PreviousMedicationsView
                                    patientId={patientId}
                                    isDoctor={isDoctor}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!showAllMedications && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="p-4"
                        >
                            {isDoctor && (
                                <>
                                    <RadioCard.Root
                                        defaultValue={templateType}
                                        onValueChange={handleValueChange}
                                        className="flex w-full mb-4"
                                    >
                                        <RadioCard.Item
                                            value="rxOrder"
                                            className={`flex-1 ${templateType === "rxOrder" ? "border-2 border-white bg-white text-orange-950" : "border-2 border-white text-white hover:bg-orange-800 transition-colors"}`}
                                        >
                                            Create Medication Prescription Referral
                                        </RadioCard.Item>
                                        <RadioCard.Item
                                            value="medOrder"
                                            className={`flex-1 ${templateType === "medOrder" ? "border-2 border-white bg-white text-orange-950" : "border-2 border-white text-white hover:bg-orange-800 transition-colors"}`}
                                        >
                                            Make Request for Unavailable Medications
                                        </RadioCard.Item>
                                    </RadioCard.Root>

                                    <AnimatePresence mode="wait">
                                        {templateType === "rxOrder" && (
                                            <motion.div
                                                key="rxOrder"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <RXOrderView
                                                    user={{
                                                        firstName: session?.user?.firstName || "",
                                                        lastName: session?.user?.lastName || "",
                                                        doctorSpecialty:
                                                            (session?.user?.doctorSpecialty as unknown as keyof typeof DoctorSpecialtyList) ||
                                                            "NOT_SELECTED",
                                                    }}
                                                    patientId={patientId}
                                                    patientInfo={{
                                                        patientName: patientInfo?.patientName || "",
                                                        phoneNumber: patientInfo?.phone?.phoneNumber || "",
                                                        dob: patientInfo?.dob ? new Date(patientInfo.dob) : new Date(),
                                                        city: patientInfo?.city || "",
                                                    }}
                                                    onNewRxOrderSaved={addRxOrder}
                                                />
                                            </motion.div>
                                        )}
                                        {templateType === "medOrder" && (
                                            <motion.div
                                                key="medOrder"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <MedOrderView
                                                    patientId={patientId}
                                                    user={{
                                                        firstName: session?.user?.firstName || "",
                                                        lastName: session?.user?.lastName || "",
                                                        doctorSpecialty:
                                                            (session?.user?.doctorSpecialty as unknown as keyof typeof DoctorSpecialtyList) ||
                                                            "NOT_SELECTED",
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                            {isTriage && (
                                <PreviousMedicationsView
                                    patientId={patientId}
                                    isDoctor={isDoctor}
                                />
                            )}
                            {!isDoctor && !isTriage && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-white mb-4"
                                >
                                    You do not have permission to view or place requests for unavailable medications.
                                </motion.p>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
            <RxOrderDrawerView
                isOpen={isShareDrawerOpen}
                onClose={() => setIsShareDrawerOpen(false)}
                rxOrder={selectedRxOrder}
                patientId={patientId}
            />
        </FormProvider>
    )
}
