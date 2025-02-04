// lib/api.ts
import axios from 'axios';
import { IPatient } from '@/models/patient';

export async function fetchPatients(): Promise<IPatient[]> {
    try {
        const response = await axios.get('/api/patient');
        console.log("API response:", response.data);
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("Invalid response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}

export async function updatePatient(id: string, data: Partial<IPatient>): Promise<IPatient> {
    const response = await axios.patch(`/api/patient/${id}`, data);
    return response.data;
}

