// apps/web/app/patient-dashboard/dashboard/DoctorCell.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell } from './TableCell';

interface DoctorCellProps {
    status: string;
    doctor?: {
        firstName?: string;
        lastName?: string;
    };
    session: {
        user: {
            accountType: string;
        };
    };
    handleTakeCase: () => void;
    handleArchive: () => void;
}

export function DoctorCell({ status, doctor, session, handleTakeCase, handleArchive }: DoctorCellProps) {
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "";
        if (!firstName) return lastName?.[0] || "";
        if (!lastName) return firstName[0];
        return `${firstName[0]}${lastName[0]}`;
    };

    if (status === 'Not Started') {
        return <TableCell align="center">{''}</TableCell>;
    }

    if (status === 'In-Progress' || status === 'Archived') {
        return (
            <TableCell align="center">
                {getInitials(doctor?.firstName, doctor?.lastName)}
            </TableCell>
        );
    }

    if (status === 'Triaged' && session.user.accountType === 'Doctor') {
        return (
            <TableCell align="center">
                <Button
                    onClick={handleTakeCase}
                    variant="ghost"
                    className="bg-black text-white rounded px-4 py-2 text-sm shadow-md"
                >
                    Take Case
                </Button>
            </TableCell>
        );
    }

    return (
        <TableCell align="center">
            <Button onClick={handleArchive}>
                Archive
            </Button>
        </TableCell>
    );
}


