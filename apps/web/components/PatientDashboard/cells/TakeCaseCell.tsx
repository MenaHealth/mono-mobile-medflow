// components/PatientDashboard/cells/TakeCaseCell.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/utils/patientUtils';

interface TakeCaseCellProps {
    status: string;
    doctor?: { firstName?: string; lastName?: string; email?: string }; // Updated type
    session: { user: { accountType: string; email?: string } } | null;
    onTakeCase: () => void;
}

export const TakeCaseCell: React.FC<TakeCaseCellProps> = ({ status, doctor, session, onTakeCase }) => {
    if (session?.user?.accountType !== 'Doctor') {
        return null; // Render nothing if the user is not a doctor
    }

    if (status === 'Not Started') {
        return null;
    }

    if (status === 'In-Progress' || status === 'Archived') {
        return <span>{doctor?.firstName && doctor?.lastName ? getInitials(doctor.firstName, doctor.lastName) : ''}</span>;
    }

    if (status === 'Triaged') {
        return (
            <Button
                onClick={onTakeCase}
                variant="default"
                color="primary"
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    textTransform: 'none',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                Take Case
            </Button>
        );
    }

    return null;
};