// components/patientViewModels/Medications/previous/PreviousMedicationsView.tsx

import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Share, ChevronsDown, ChevronsUp } from "lucide-react";
import { ScrollArea } from "../../../ui/scroll-area";
import RxOrderDrawerView from "../rx/RxOrderDrawerView";
import { Button } from "@/components/ui/button";
import { Types } from "mongoose";
import { AnimatePresence, motion } from "framer-motion";
import { usePatientDashboard } from "@/components/patientViewModels/PatientViewModelContext";
import { isRxOrder } from "@/utils/typeGuards";
import {IRxOrder} from "@/models/patient";
import {IMedOrder} from "@/models/medOrder";

interface PreviousMedicationsViewProps {
    patientId: string | Types.ObjectId;
    isDoctor: boolean;
}

export default function PreviousMedicationsView({ patientId, isDoctor }: PreviousMedicationsViewProps) {
    if (!patientId) {
        console.error("Missing patientId in PreviousMedicationsView.");
    }

    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);
    const [expandAll, setExpandAll] = useState(false);

    const isLoading = loadingMedications;

    const allMedications = React.useMemo(() => {
        return [...rxOrders, ...medOrders].sort((a, b) => {
            const dateA = new Date(isRxOrder(a) ? a.prescribedDate : a.orderDate);
            const dateB = new Date(isRxOrder(b) ? b.prescribedDate : b.orderDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [rxOrders, medOrders]);

    const updateExpandedItems = useCallback(() => {
        setExpandedItems(new Set(expandAll ? allMedications.map((item) => item._id ?? "") : []));
    }, [expandAll, allMedications]);

    useEffect(() => {
        updateExpandedItems();
    }, [updateExpandedItems]);

    if (isLoading) {
        return (
            <p className="text-white text-center" aria-live="polite">
                Loading medications...
            </p>
        );
    }

    const toggleItemExpansion = (itemId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleOpenDrawer = (rxOrder: IRxOrder) => {
        setSelectedRxOrder(rxOrder);
        setIsDrawerOpen(true);
    };

    const toggleExpandAll = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setExpandAll((prev) => !prev);
    };

    const formatDateTime = (date: Date) => {
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const renderMedicationItem = (item: IRxOrder | IMedOrder) => {
        const isRx = isRxOrder(item);
        const itemId = item._id?.toString() ?? "";
        const isExpanded = expandedItems.has(itemId);
        const dateTime = new Date(isRx ? item.prescribedDate : item.orderDate);

        return (
            <motion.li
                key={itemId}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-white border-white border-t-2 border-l-2 p-4 m-4 rounded-lg"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <motion.button
                            onClick={(e) => toggleItemExpansion(itemId, e)}
                            className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                            aria-expanded={isExpanded}
                            aria-controls={`medication-details-${itemId}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </motion.button>
                        <h3 className="text-center bg-white border-2 p-2 text-orange-950 inline-block ml-12">
                            {isRx ? "Medication Prescription Referral" : "Request for Unavailable Medications"}
                        </h3>
                    </div>
                    {isRx && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDrawer(item)}>
                            <Share />
                            <span className="sr-only">Share Medication Prescription Referral</span>
                        </Button>
                    )}
                </div>
                <p className="mt-2 text-right">{formatDateTime(dateTime)}</p>
                <p className="mt-2 text-center">
                    <i>{item.doctorSpecialty}</i>
                </p>
                <h4 className="text-left">
                    Dr. <b>{item.prescribingDr}</b>
                </h4>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            id={`medication-details-${itemId}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 p-2 bg-white text-darkBlue rounded-sm overflow-hidden"
                        >
                            <p>
                                <strong>City:</strong> {isRx ? item.city : item.patientCity}
                            </p>
                            {isRx && (
                                <p>
                                    <strong>Valid Till:</strong> {formatDateTime(new Date(item.validTill))}
                                </p>
                            )}
                            <h4 className="mt-2 font-bold">{isRx ? "Prescriptions:" : "Medications:"}</h4>
                            {isRx
                                ? item.prescriptions.map((med, medIndex) => (
                                    <motion.div
                                        key={`${itemId}-med-${medIndex}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: medIndex * 0.1 }}
                                        className="mt-2 p-2 bg-gray-100 rounded-sm"
                                    >
                                        <p>
                                            <strong>Diagnosis:</strong> {med.diagnosis}
                                        </p>
                                        <p>
                                            <strong>Medication:</strong> {med.medication}
                                        </p>
                                        <p>
                                            <strong>Dosage:</strong> {med.dosage}
                                        </p>
                                        <p>
                                            <strong>Frequency:</strong> {med.frequency}
                                        </p>
                                    </motion.div>
                                ))
                                : item.medications.map((med, medIndex) => (
                                    <motion.div
                                        key={`${itemId}-med-${medIndex}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: medIndex * 0.1 }}
                                        className="mt-2 p-2 bg-gray-100 rounded-sm"
                                    >
                                        <p>
                                            <strong>Diagnosis:</strong> {med.diagnosis}
                                        </p>
                                        <p>
                                            <strong>Medication:</strong> {med.medication}
                                        </p>
                                        <p>
                                            <strong>Dosage:</strong> {med.dosage}
                                        </p>
                                        <p>
                                            <strong>Frequency:</strong> {med.frequency}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {med.quantity}
                                        </p>
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.li>
        );
    };

    return (
        <div className="h-full bg-orange-950">
            <div className="flex justify-center items-center py-2">
                <motion.button
                    onClick={toggleExpandAll}
                    className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {expandAll ? <ChevronsUp className="h-5 w-5" /> : <ChevronsDown className="h-5 w-5" />}
                </motion.button>
            </div>
            <ScrollArea className="h-full w-full">
                {allMedications.length > 0 ? (
                    <motion.ul
                        className="list-none m-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {allMedications.map(renderMedicationItem)}
                    </motion.ul>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-2 border-white border-2 text-white rounded-lg m-4 p-4 text-center"
                    >
                        <p>
                            <strong>No previous medications found</strong> for this patient.
                        </p>
                    </motion.div>
                )}
            </ScrollArea>

            <RxOrderDrawerView
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                rxOrder={selectedRxOrder}
                patientId={typeof patientId === "string" ? new Types.ObjectId(patientId) : patientId}
            />
        </div>
    );
}