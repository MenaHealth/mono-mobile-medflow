// components/PatientDashboard/DashboardView.tsx
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ToastProvider } from '@/components/ui/toast';
import { PatientTable } from './PatientTable';
import * as Toast from '@radix-ui/react-toast';
import { useDashboardViewModel } from './DashboardViewModel';
import { Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Session} from "next-auth";

interface Props {
    session: Session | null
}

const DashboardView: React.FC<Props> = ({ session }) => {
    const {
        setRows,
        rows,
        allData,
        session: viewModelSession, // Use viewModelSession to avoid naming conflict
        isLoading,
        error,
        handleStatusChange,
        handleTakeCase,
        handleArchive,
        updatePatient,
        open,
        setOpen,
        message,
        router,
        showArchived,
        setShowArchived,
        sortedAndFilteredRows,
        handleSpecialtyChangeWithNotification,
    } = useDashboardViewModel()

    const [isInfoOpen, setIsInfoOpen] = React.useState(false);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const loadingStates = {
        // Example loading state
        isLoading: false,
        isError: false,
    }

    return (
        <ToastProvider>
            <div className="w-full h-screen px-0 relative dashboard-page">
                <div className="flex items-center justify-between py-3">
                    <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>About Patient Dashboard</DialogTitle>
                                <DialogDescription>
                                    This dashboard is for viewing and managing patients. You can filter patients, change their status, and take cases. Use the filters at the top to narrow down the patient list. Click on a patient row for more details.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <h1 className="flex-1 text-center font-bold">
                        <h3 className="text-left text-h3 underline">Patient Dashboard</h3>
                    </h1>

                    {["Evac", "Triage", "Doctor"].includes(session?.user?.accountType ?? '') && (
                        <Button
                            onClick={() => router.push('/create-patient')}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md"
                        >
                            Create Patient
                        </Button>
                    )}

                </div>
                <div className="h-[calc(100vh-12rem)] w-full">
                    {session?.user?.accountType === "Triage" && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowArchived((prev) => !prev);
                                console.log("Toggled Show Archived:", !showArchived);
                            }}
                            className="ml-4 mb-2"
                        >
                            {showArchived ? "Hide Archived Patients" : "Show Archived Patients"}
                        </Button>
                    )}
                    <PatientTable
                        rows={sortedAndFilteredRows}
                        setRows={setRows}
                        allData={allData}
                        session={viewModelSession} // Use viewModelSession here as well
                        handleStatusChange={handleStatusChange}
                        handleTakeCase={handleTakeCase}
                        handleArchive={handleArchive}
                        updatePatient={updatePatient}
                        userType={
                            viewModelSession?.user?.accountType === "Triage"
                                ? "triage"
                                : viewModelSession?.user?.accountType === "Doctor"
                                    ? "doctor"
                                    : "evac"
                        }
                        showArchived={showArchived}
                        handleSpecialtyChangeWithNotification={handleSpecialtyChangeWithNotification}
                        loadingStates={loadingStates}
                    />
                </div>
            </div>
            <Toast.Provider>
                <Toast.Root
                    className="bg-black text-white p-3 rounded-lg shadow-lg"
                    open={open}
                    onOpenChange={setOpen}
                    duration={3000}
                >
                    <Toast.Title>{message}</Toast.Title>
                </Toast.Root>
                <Toast.Viewport className="fixed bottom-5 left-1/2 transform -translate-x-1/2" />
            </Toast.Provider>
        </ToastProvider>
    );
}

export default DashboardView

