// apps/web/app/api/user/get-by-specialty/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: Request) {
    try {
        const { specialty } = await request.json();

        if (!specialty) {
            return NextResponse.json({ error: 'Specialty is required.' }, { status: 400 });
        }

        await dbConnect();

        // Find users with the requested specialty
        const users = await User.find({ doctorSpecialty: specialty });

        // If no users are found, return an empty array for doctors
        if (!users || users.length === 0) {
            return NextResponse.json({ doctors: [] }); // Ensure doctors is always defined
        }

        // Map the required doctor details
        const doctors = users.map((user) => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }));

        return NextResponse.json({ doctors });
    } catch (error) {
        console.error('Error fetching users by specialty:', error);
        return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
}