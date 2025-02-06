// app/api/admin/GET/existing-users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from './../../../../../utils/database';
import User from "./../../../../../models/user";

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    try {
        const query: any = { authorized: true };

        if (search) {
            query.$or = [
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Fetch all authorized users
        const existingUsers = await User.find(query)
            .select('+authorized firstName lastName doctorSpecialty email accountType countries approvalDate')
            .sort({ approvalDate: -1 }); // Sort by approval date (newest first)

        return NextResponse.json({ users: existingUsers });
    } catch (error) {
        console.error('Error fetching existing users:', error);
        return NextResponse.json({ error: 'Failed to fetch existing users' }, { status: 500 });
    }
}