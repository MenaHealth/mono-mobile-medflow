// components/patientViewModels/PatientViewModelContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { PatientInfoViewModel } from "./patient-info/PatientInfoViewModel";
import { IPatient } from '@/models/patient';
import { INote } from '@/models/note';
import { IRxOrder } from '@/models/patient';
import { IMedOrder } from '@/models/medOrder';
import {Types} from "mongoose";

export interface PatientInfo {
    patientName: string;
    city: string;
    gender: string;
    dob: Date;
    country: string;
    language: string;
    phone: {
        countryCode: string;
        phoneNumber: string;
    };
    patientID: string;
    telegramChatId?: string;
}

interface PatientContext {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    patientInfo: PatientInfo | null;
    setPatientInfo: (patientInfo: PatientInfo | null) => void;
    notes: INote[];
    draftNotes: INote[];
    loadingPatientInfo: boolean;
    loadingNotes: boolean;
    fetchPatientData: () => Promise<void>;
    patientViewModel: PatientInfoViewModel | null;
    isExpanded: boolean;
    toggleExpand: () => void;
    refreshPatientNotes: () => Promise<void>;
    rxOrders: IRxOrder[];
    medOrders: IMedOrder[];
    loadingMedications: boolean;
    refreshMedications: () => Promise<void>;
    addRxOrder: (newRxOrder: IRxOrder) => void;
    addMedOrder: (newMedOrder: IMedOrder) => void;
}

export const isRxOrder = (item: IRxOrder | IMedOrder): item is IRxOrder => {
    return (item as IRxOrder).prescriptions !== undefined;
};

const PatientViewModelContext = createContext<PatientContext | undefined>(undefined);


export const usePatientDashboard = () => {
    const context = useContext(PatientViewModelContext);
    if (!context) {
        throw new Error("usePatientDashboard must be used within PatientDashboardProvider");
    }
    return context;
};

export const PatientDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { id: patientId } = useParams() as { id: string };
    const [activeTab, setActiveTab] = useState('patient-dashboard');
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [notes, setNotes] = useState<INote[]>([]);
    const [draftNotes, setDraftNotes] = useState<INote[]>([]);
    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
    const [loadingNotes] = useState(false);
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [rxOrders, setRxOrders] = useState<IRxOrder[]>([]);
    const [medOrders, setMedOrders] = useState<IMedOrder[]>([]);
    const [loadingMedications, setLoadingMedications] = useState(false);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const formatPatientInfo = useCallback((patientData: IPatient, id: string) => {
        const patientInfo: PatientInfo = {
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            city: patientData.city || '',
            country: patientData.country || '',
            language: patientData.language || '',
            gender: patientData.genderPreference || '',
            dob: patientData.dob ? new Date(patientData.dob) : new Date(),
            phone: {
                countryCode: patientData.phone?.countryCode || '',
                phoneNumber: patientData.phone?.phoneNumber || '',
            },
            patientID: id,
            telegramChatId: patientData.telegramChatId || "",
        };

        setPatientInfo(patientInfo); // Update patientInfo in context
        setPatientViewModel(new PatientInfoViewModel(patientData));
    }, []);

    const memoizedPatientInfo = useMemo(() => patientInfo, [patientInfo]);

    const formatPreviousNotes = useCallback((notesData: INote[]) => {
        if (Array.isArray(notesData)) {
            const formattedNotes = notesData.map((note) => {
                const plainNote = note.toObject ? note.toObject() : note;
                return {
                    ...plainNote,
                    title: plainNote.noteType,
                    patientName: memoizedPatientInfo?.patientName || '',
                } as INote;
            });
            setNotes(formattedNotes.filter((note) => note.draft === false));
            setDraftNotes(formattedNotes.filter((note) => note.draft === true));
        } else {
            setNotes([]);
            setDraftNotes([]);
        }
    }, [memoizedPatientInfo?.patientName]);

    const fetchMedOrders = useCallback(async (): Promise<IMedOrder[]> => {
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            if (!response.ok) throw new Error("Error fetching med orders data")

            const data = await response.json()
            console.log("Fetched med orders from API:", data)
            return data as IMedOrder[]
        } catch (error) {
            console.error("Error fetching med orders:", error)
            return []
        }
    }, [patientId])

    const fetchPatientData = useCallback(async () => {
        setLoadingPatientInfo(true);
        setLoadingMedications(true);
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Format patient info
            formatPatientInfo(data.patient, patientId);

            // Format notes
            if (data.patient.notes) {
                formatPreviousNotes(data.patient.notes);
            } else {
                setNotes([]);
            }

            // Handle Rx Orders
            const formattedRxOrders = (data.patient.rxOrders || []).map((order: IRxOrder | string) =>
                typeof order === "string"
                    ? ({
                        id: order,
                        rxOrderId: "",
                        doctorSpecialty: "General",
                        prescribingDr: "Unknown",
                        drEmail: "unknown@unknown.com",
                        drId: "unknown",
                        prescribedDate: new Date(),
                        validTill: new Date(),
                        city: "Unknown City",
                        validated: false,
                        prescriptions: [],
                    } as IRxOrder)
                    : order,
            )
            setRxOrders(formattedRxOrders)

            // Fetch Med Orders
            const detailedMedOrders = await fetchMedOrders()
            setMedOrders(detailedMedOrders)
        } catch (error) {
            console.error("Error fetching patient data:", error)
        } finally {
            setLoadingPatientInfo(false)
            setLoadingMedications(false)
        }
    }, [patientId, formatPatientInfo, formatPreviousNotes, fetchMedOrders])

    const refreshMedications = useCallback(async () => {
        setLoadingMedications(true);
        try {
            await fetchPatientData();
        } catch (error) {
            console.error('Error refreshing medications:', error);
        } finally {
            setLoadingMedications(false);
        }
    }, [fetchPatientData]);


    const addRxOrder = useCallback((newRxOrder: IRxOrder) => {
        setRxOrders((prevOrders) => [newRxOrder, ...prevOrders]);
    }, []);

    const addMedOrder = useCallback((newMedOrder: IMedOrder) => {
        setMedOrders((prevOrders) => [newMedOrder, ...prevOrders]); // Add the new med order to the top
    }, []);

    return (
        <PatientViewModelContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                setPatientInfo,
                notes,
                draftNotes,
                loadingPatientInfo,
                loadingNotes,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
                refreshPatientNotes: fetchPatientData,
                rxOrders,
                medOrders,
                loadingMedications,
                refreshMedications,
                addRxOrder,
                addMedOrder,
            }}
        >
            {children}
        </PatientViewModelContext.Provider>
    );
};

export default function Component() {
    return null;
}