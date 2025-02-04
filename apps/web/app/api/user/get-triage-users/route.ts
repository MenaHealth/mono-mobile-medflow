
import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all users with accountType 'Triage'
        const triageUsers = await User.find({ accountType: 'Triage' }, 'email firstName lastName');

        return NextResponse.json({ triageUsers });
    } catch (error) {
        console.error('Error fetching Triage users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';