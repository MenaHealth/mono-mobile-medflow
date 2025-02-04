// components/PatientDashboard/DashboardViewModel.ts
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchPatients, updatePatient } from '@/lib/api';
import { useFilters } from '@/components/hooks/useFilters';
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';
import { IPatient } from '@/models/patient';
import axios from "axios";
import { useToast } from '@/components/hooks/useToast';


export function useDashboardViewModel() {
    const { data: session, status } = useSession();
    const [allData, setAllData] = useState<IPatient[]>([]);
    const [rows, setRows] = useState<IPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { filters, setFilter, clearFilters } = useFilters();
    const toggleShowArchived = () => {
        setShowArchived(!showArchived);
    };

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const { setToast } = useToast()
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
    const [doctorFilter, setDoctorFilter] = useState<string>("all");
    const [showArchived, setShowArchived] = useState(false); // Toggle for archived patients

    const triggerToast = (msg: string) => {
        setMessage(msg);
        setOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (status === 'authenticated' && session?.user) {
                try {
                    setIsLoading(true);
                    const data = await fetchPatients();
                    setAllData(data);
                    setError(null);
                } catch (error) {
                    console.error("Error fetching patients:", error);
                    setError("Failed to fetch patients. Please try again.");
                    triggerToast("Failed to fetch patients. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [status, session]);

    const sortedAndFilteredRows = React.useMemo(() => {
        if (!session?.user || allData.length === 0) {
            console.log("Session is not authenticated or no data available.");
            return [];
        }

        let filteredRows = [...allData];

        // Filter out archived patients if `showArchived` is false
        if (!showArchived) {
            filteredRows = filteredRows.filter((row) => row.status !== "Archived");
        }

        // For Gaza Evac Coordinators
        if (session.user.accountType === "Evac") {
            filteredRows = filteredRows.filter(
                (row) => row.specialty === DoctorSpecialtyList.GAZA_MED_EVACUATIONS
            );
        }

        // For Doctors, filter by their specialties
        if (session.user.accountType === "Doctor" && session.user.doctorSpecialty) {
            const doctorSpecialty = session.user.doctorSpecialty as unknown as DoctorSpecialtyList[];
            filteredRows = filteredRows.filter(
                (patient) =>
                    doctorSpecialty.some((specialty) => specialty === patient.specialty) &&
                    ["Triaged", "In-Progress", "Completed"].includes(patient.status || "")
            );
        }

        // Apply priority filter
        if (priorityFilter !== "all") {
            filteredRows = filteredRows.filter((row) => row.priority === priorityFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filteredRows = filteredRows.filter((row) => row.status === statusFilter);
        }

        // Apply specialty filter
        if (specialtyFilter !== "all") {
            filteredRows = filteredRows.filter((row) => row.specialty === specialtyFilter);
        }

        // Filter by doctor (owned or unassigned patients)
        if (doctorFilter !== "all") {
            if (doctorFilter === "my") {
                filteredRows = filteredRows.filter(
                    (row) => row.doctor?.email === session.user.email
                );
            } else {
                filteredRows = filteredRows.filter(
                    (row) => !row.doctor || Object.keys(row.doctor).length === 0
                );
            }
        }

        // Sort by ID (or any other criteria)
        const sortedRows = filteredRows.sort((a, b) => b._id.localeCompare(a._id));

        return sortedRows;
    }, [
        allData,
        showArchived,
        priorityFilter,
        statusFilter,
        specialtyFilter,
        doctorFilter,
        session,
    ]);

    useEffect(() => {
        setRows(sortedAndFilteredRows); // Update rows whenever filtered rows change
    }, [sortedAndFilteredRows]);

    const handleSpecialtyChangeWithNotification = useCallback(
        async (patientId: string, specialty: DoctorSpecialtyList) => {
            setLoadingStates((prev) => ({ ...prev, [patientId]: true }))

            try {
                const response = await axios.patch(`/api/patient/${patientId}/triage`, {
                    specialty,
                    triagedBy: { email: session?.user?.email },
                })

                if (response.status === 200) {
                    setAllData((prevData: IPatient[]) =>
                        prevData.map((patient) => {
                            if (patient._id === patientId) {
                                return {
                                    ...patient,
                                    specialty: specialty,
                                } as IPatient
                            }
                            return patient
                        }),
                    )

                    const specialtyResponse = await axios.post("/api/user/get-by-specialty", { specialty })
                    const doctors = specialtyResponse?.data?.doctors || []

                    if (doctors.length > 0) {
                        await axios.post("/api/user/send-specialty-notification", {
                            doctors,
                            subject: `New Case for ${specialty}`,
                            message: `There is a new case requiring attention for your specialty: ${specialty}. Please check your dashboard for more details.`,
                            patientCountry: rows.find((patient) => patient._id === patientId)?.country || "Unknown",
                        });

                        setToast({
                            title: "Notification Sent",
                            description: `Specialty notification sent successfully for ${specialty}`,
                            variant: "success",
                        })
                    } else {
                        setToast({
                            title: "Specialty Updated",
                            description: `Patient specialty updated to ${specialty}, but no doctors are available for this specialty.`,
                            variant: "default",
                        })
                    }
                } else {
                    setToast({
                        title: "Update Failed",
                        description: "Failed to update the patient's specialty.",
                        variant: "error",
                    })
                }
            } catch (error) {
                console.error("Error updating specialty or sending notification:", error)
                setToast({
                    title: "Error",
                    description: "An error occurred while updating the specialty.",
                    variant: "destructive",
                })
            } finally {
                setLoadingStates((prev) => ({ ...prev, [patientId]: false }))
            }
        },
        [setToast, session],
    );

// Update state whenever sorted and filtered rows change
    useEffect(() => {
        console.log("Setting rows with filtered data:", sortedAndFilteredRows);
        setRows(sortedAndFilteredRows);
    }, [sortedAndFilteredRows, showArchived]);


    const handleStatusChange = async (value: IPatient['status'], row: IPatient, index: number) => {
        let triagedBy = row.triagedBy ?? {};
        let doctor = row.doctor ?? {};
        if (value === 'Not Started') {
            doctor = {};
            triagedBy = {};
        } else if (value === 'Triaged') {
            if (session?.user?.accountType !== 'Triage' && session?.user?.accountType !== 'Evac') {
                triggerToast('You do not have the correct permissions to triage patients');
                return;
            }
            triagedBy = { firstName: session?.user?.firstName, lastName: session?.user?.lastName, email: session?.user?.email };
            doctor = {};
        } else if (value === 'In-Progress') {
            if (session?.user?.accountType === 'Triage' || session?.user?.accountType === 'Evac') {
                triggerToast('You must be a doctor to take this patient.');
                return;
            }
            doctor = { firstName: session?.user?.firstName, lastName: session?.user?.lastName, email: session?.user?.email };
        }

        try {
            await updatePatient(rows[index]._id, { status: value, triagedBy, doctor });
            const updatedRows = [...rows];
            updatedRows[index].status = value;
            updatedRows[index].triagedBy = triagedBy;
            updatedRows[index].doctor = doctor;
            setRows(updatedRows);
        } catch (error) {
            console.log(error);
        }
    };

    const handleTakeCase = async (index: number) => {
        let doctor = { firstName: session?.user?.firstName, lastName: session?.user?.lastName, email: session?.user?.email };

        try {
            await updatePatient(rows[index]._id, { status: "In-Progress", doctor: doctor });
            const updatedRows = [...rows];
            updatedRows[index].status = "In-Progress";
            updatedRows[index].doctor = doctor;
            setRows(updatedRows);
        } catch (error) {
            console.log(error);
        }
    };

    const handleArchive = async (index: number) => {
        try {
            await updatePatient(rows[index]._id, { status: "Archived" });
            const updatedRows = [...rows];
            updatedRows[index].status = "Archived";
            setRows(updatedRows.filter((row) => row.status !== "Archived"));
        } catch (error) {
            console.log(error);
        }
    };

    return {
        session,
        status,
        rows,
        setRows,
        isLoading,
        error,
        filters,
        setFilter,
        clearFilters,
        handleStatusChange,
        handleTakeCase,
        handleArchive,
        updatePatient,
        open,
        setOpen,
        message,
        router,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        specialtyFilter,
        setSpecialtyFilter,
        doctorFilter,
        setDoctorFilter,
        showArchived,
        setShowArchived,
        toggleShowArchived,
        sortedAndFilteredRows,
        handleSpecialtyChangeWithNotification,
        loadingStates,
        allData,
    };
}
