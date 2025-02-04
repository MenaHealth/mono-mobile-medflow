// components/PatientDashboard/PatientTable.tsx
import React, {useCallback, useState} from 'react';
import { Table } from '@/components/ui/Table/Table';
import { Button } from '@/components/ui/button';
import { StatusDropdown } from './filters/StatusDropdown';
import { PriorityDropdown } from './filters/PriorityDropdown';
import { SpecialtyDropdown } from './filters/SpecialtyDropdown';
import { DoctorCell } from './cells/DoctorCell';
import { NotesCell } from '@/components/PatientDashboard/cells/NotesCell';
import { formatLocation, getInitials, dobToAge } from '@/utils/patientUtils';
import { useRouter } from 'next/navigation';
import { IPatient } from '@/models/patient';
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';
import {TableColumn} from "@/components/ui/Table/types";
import { motion } from 'framer-motion';
import {ChiefComplaintCell} from "@/components/PatientDashboard/cells/ChiefComplaintCell";
import {TakeCaseCell} from "@/components/PatientDashboard/cells/TakeCaseCell";
import axios from "axios";
import { useToast } from '@/components/hooks/useToast';
import {Loader2} from "lucide-react";



interface PatientTableProps {
    setRows: React.Dispatch<React.SetStateAction<IPatient[]>>
    rows: IPatient[]
    allData: IPatient[]
    session: { user: { accountType: string; email?: string } } | null
    handleStatusChange: (newStatus: IPatient["status"], patient: IPatient, index: number) => void
    handleTakeCase: (index: number) => void
    handleArchive: (index: number) => void
    updatePatient: (id: string, data: Partial<IPatient>) => Promise<IPatient>
    userType: "triage" | "doctor" | "evac"
    showArchived: boolean
    handleSpecialtyChangeWithNotification: (patientId: string, specialty: DoctorSpecialtyList) => Promise<void>
    loadingStates: Record<string, boolean>
}

export function PatientTable({
                                 rows,
                                 setRows,
                                 allData,
                                 session,
                                 handleStatusChange,
                                 handleTakeCase,
                                 updatePatient,
                                 userType,
                                 showArchived,
                                 handleSpecialtyChangeWithNotification,
                                 loadingStates,
                             }: PatientTableProps) {
    const { setToast } = useToast()
    const router = useRouter();
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

    // Color Mapping
    const colors = {
        triage: {
            primary: 'yellow-500',
            lighter: 'yellow-100',
            darker: 'darkBlue',
        },
        doctor: {
            primary: 'orange-500',
            lighter: 'orange-100',
            darker: 'darkBlue',
        },
        evac: {
            primary: 'red-500',
            lighter: 'red-100',
            darker: 'darkBlue',
        },
    };

    const { primary: PrimaryColor, lighter: LighterColor, darker: DarkerColor } =
    colors[userType] || {
        primary: 'gray-500',
        lighter: 'gray-100',
        darker: 'gray-900',
    };

    const [hoveredStates, setHoveredStates] = useState<Record<string, boolean>>({});

    const handleHoverStart = (id: string) => {
        setHoveredStates((prev) => ({ ...prev, [id]: true }));
    };

    const handleHoverEnd = (id: string) => {
        setHoveredStates((prev) => ({ ...prev, [id]: false }));
    };
    const [isAllExpanded, setIsAllExpanded] = useState(false);


    const handlePatientClick = (patientId: string, doctor: IPatient['doctor']) => {
        if (session?.user?.accountType === 'Doctor') {
            if (doctor && Object.keys(doctor).length > 0) {
                if (doctor.email !== session.user.email) {
                    return;
                }
            } else {
                console.warn("Doctor information is missing or invalid:", doctor);
            }
        } else if (!session) {
            console.warn("Session is undefined or null:", session);
        }
        router.push(`/patient/${patientId}`);
    };


    const columns: TableColumn<IPatient>[] = [
        {
            key: "_id",
            header: "Patient ID",
            render: (value: string, item: IPatient) => {
                const isHovered = hoveredStates[item._id] || false
                const isLoading = loadingStates[item._id] || false

                return (
                    <motion.div
                        className="relative group flex items-center"
                        onHoverStart={() => handleHoverStart(item._id)}
                        onHoverEnd={() => handleHoverEnd(item._id)}
                    >
                        <Button
                            variant="outline"
                            onClick={() => handlePatientClick(item._id, item.doctor)}
                            className="mr-2 max-w-[80px] truncate"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : value}
                        </Button>
                        {isHovered && !isLoading && (
                            <motion.div
                                className={`absolute top-full left-0 text-xs rounded px-2 py-1 mt-1 max-w-xs whitespace-normal bg-${DarkerColor} text-${LighterColor}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {value}
                            </motion.div>
                        )}
                    </motion.div>
                )
            },
            width: "150px",
        },
        { key: 'lastName', header: 'Last Name', width: '150px' },
        {
            key: 'dob',
            header: 'Age',
            render: (value: string) => value ? dobToAge(value.toString()) : '',
            width: '80px'
        },
        {
            key: 'location',
            header: 'Location',
            render: (_: any, item: IPatient) => formatLocation(item.city || '', item.country || ''),
            width: '150px'
        },
        { key: 'language', header: 'Language Spoken', width: '150px' },
        {
            key: 'chiefComplaint',
            header: 'Chief Complaint',
            render: (value: string, item: IPatient) => (
                <ChiefComplaintCell
                    value={value}
                    itemId={item._id}
                    PrimaryColor={PrimaryColor}
                    LighterColor={LighterColor}
                    DarkerColor={DarkerColor}
                    isAllExpanded={isAllExpanded}
                    expandedStates={expandedStates}
                    setExpandedStates={setExpandedStates}
                />
            ),
            width: '200px',
        },
        {
            key: 'status',
            header: 'Status',
            render: (value: IPatient['status'], item: IPatient) => (
                <StatusDropdown
                    status={value || 'Not Started'}
                    onChange={(newStatus) => handleStatusChange(newStatus as IPatient['status'], item, rows.indexOf(item))}
                />
            ),
            width: '150px',
            filter: true
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (value: IPatient['priority'], item: IPatient) => (
                <PriorityDropdown
                    priority={value || 'Not Selected'}
                    onChange={(newPriority) => updatePatient(item._id, { priority: newPriority as IPatient['priority'] })}
                />
            ),
            width: '150px',
            filter: true // Add this line
        },
        {
            key: "specialty",
            header: "Specialty",
            render: (value: DoctorSpecialtyList, item: IPatient) => {
                const currentSpecialty = allData.find((patient) => patient._id === item._id)?.specialty || "Not Selected"
                return (
                    <SpecialtyDropdown
                        specialty={currentSpecialty}
                        onChange={(newSpecialty) => handleSpecialtyChangeWithNotification(item._id, newSpecialty)}
                        isLoading={loadingStates[item._id] || false}
                        disabled={session?.user?.accountType !== "Triage"}
                    />
                )
            },
            width: "200px",
            filter: true,
        },
        {
            key: 'dashboardNotes',
            header: 'Additional Notes',
            render: (value: string, item: IPatient) => (
                <NotesCell
                    notes={value || ''}
                    onUpdate={(newNotes: string) => updatePatient(item._id, { dashboardNotes: newNotes })}
                    drawerColor={LighterColor}
                    badgeColor={PrimaryColor}
                    iconTextColor={DarkerColor}
                    iconBackgroundColor={LighterColor}
                />
            ),
            width: '200px'
        },
        {
            key: 'triagedBy',
            header: 'Triaged By',
            render: (value: { firstName: string, lastName: string }) => getInitials(value?.firstName || '', value?.lastName || ''),
            width: '100px'
        },
        {
            key: 'genderPreference',
            header: 'Dr. Pref',
            render: (value: string) => {
                if (value === 'Male') return <span style={{ fontSize: '1.5em'}}>♂</span>;
                if (value === 'Female') return <span style={{ fontSize: '1.5em'}}>♀</span>;
                return 'N/A';
            },
            width: '80px'
        },
        {
            key: 'doctor',
            header: 'Doctor',
            render: (_: any, item: IPatient) =>
                userType === 'doctor' ? (
                    <TakeCaseCell
                        status={item.status || 'Not Started'}
                        doctor={item.doctor}
                        session={session}
                        onTakeCase={() => handleTakeCase(rows.indexOf(item))}
                    />
                ) : null,
            width: '150px',
        },
        {
            key: 'createdAt',
            header: 'Created At',
            render: (value: string) => value ? new Date(value).toLocaleString() : '',
            width: '150px'
        },
    ];
    const displayedRows = showArchived ? rows : rows.filter(row => row.status !== 'Archived');


    return (
        <Table<IPatient>
            data={displayedRows}
            columns={columns}
            backgroundColor={LighterColor}
            textColor="gray-900"
            borderColor={DarkerColor}
            headerBackgroundColor={'darkBlue'}
            headerTextColor={LighterColor}
            hoverBackgroundColor="gray-50"
            hoverTextColor="gray-900"
            stickyHeader={true}
        />
    );
}

