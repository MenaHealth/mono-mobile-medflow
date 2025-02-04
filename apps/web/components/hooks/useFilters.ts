// components/hooks/useFilters.ts
import { useState } from 'react';

interface Filters {
    priorityFilter: string;
    statusFilter: string;
    specialtyFilter: string;
    doctorFilter: string;
    chiefComplaintFilter: string;
}

export function useFilters() {
    const [filters, setFilters] = useState<Filters>({
        priorityFilter: 'all',
        statusFilter: 'all',
        specialtyFilter: 'all',
        doctorFilter: 'all',
        chiefComplaintFilter: 'all',
    });

    const setFilter = (filterName: keyof Filters, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            priorityFilter: 'all',
            statusFilter: 'all',
            specialtyFilter: 'all',
            doctorFilter: 'all',
            chiefComplaintFilter: 'all',
        });
    };

    return { filters, setFilter, clearFilters };
}

