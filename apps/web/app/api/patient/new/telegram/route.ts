// apps/web/app/api/patient/new/telegram/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Patient from '@/models/patient';
import TelegramThread from '@/models/telegramThread';
import { getRegistrationMessage } from '@/utils/telegram/postRegistrationConfirmation';
import { sendTriageNotification } from "@/utils/emails/triage-notification";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { patientId, language, ...updateData } = await request.json();

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        const supportedLanguages = ['English', 'Arabic', 'Farsi', 'Pashto'];
        const patientLanguage = supportedLanguages.includes(language) ? language : 'English';

        let patient = await Patient.findById(patientId);
        if (!patient) {
            patient = new Patient({
                _id: patientId,
                language: patientLanguage,
                ...updateData,
            });
            await patient.save();
        } else {
            patient.language = patientLanguage;
            Object.assign(patient, updateData);
            await patient.save();
        }

        if (patient.telegramChatId) {
            await TelegramThread.findOneAndUpdate(
                { chatId: patient.telegramChatId },
                { $set: { patientId: patient._id } },
                { new: true }
            );
        }

        const message = getRegistrationMessage(patientLanguage);

        await fetch(`${process.env.NEXTAUTH_URL}/api/telegram-bot/send-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramChatId: patient.telegramChatId,
                message,
            }),
        });

        // After patient is created/updated
        const country = patient?.country || "an unknown location"; // Default to "unknown location" if country is not provided

        // Fetch Triage users
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/get-triage-users`);
        const { triageUsers } = await response.json();

        if (triageUsers && triageUsers.length > 0) {
            const subject = `New Patient Sign-Up Notification`;
            const notificationMessage = `A new patient has signed up from ${country}. Please check the dashboard for more details.`;
            await sendTriageNotification(triageUsers, subject, notificationMessage);
        } else {
            console.warn("No Triage users found to notify.");
        }

        return NextResponse.json({ message: 'Patient created/updated successfully', patient });
    } catch (error) {
        console.error('Error creating/updating patient:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}