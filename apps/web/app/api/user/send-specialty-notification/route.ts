// app/api/user/send-specialty-notification/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sendSpecialtyNotification, Doctor } from '@/utils/emails/specialty-notification';

export async function POST(request: Request) {
    try {
        const { doctors, subject, message, patientCountry } = await request.json();

        if (!doctors || !Array.isArray(doctors) || doctors.length === 0) {
            return NextResponse.json({ error: 'Valid doctors are required.' }, { status: 400 });
        }

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
        }


        if (!patientCountry || typeof patientCountry !== "string") {
            return NextResponse.json({ error: "Patient country is required." }, { status: 400 });
        }

        // Validate that each doctor object has the required fields
        const validDoctors = doctors.every((doctor: Doctor) =>
            doctor.email && doctor.firstName && doctor.lastName
        );

        if (!validDoctors) {
            return NextResponse.json({ error: 'Each doctor must have email, firstName, and lastName.' }, { status: 400 });
        }

        await sendSpecialtyNotification(doctors, subject, message, patientCountry);

        return NextResponse.json({ message: 'Notification sent successfully.' });
    } catch (error) {
        console.error('Error sending specialty notification:', error);
        return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
}

