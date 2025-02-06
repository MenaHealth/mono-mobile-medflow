/// app/api/auth/forgot-password/send-text-verification-code/route.ts

import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emails/forgot-password';
import User from '@/models/user';
import crypto from 'crypto';
import dbConnect from "@/utils/database";

const rateLimitMap = new Map<string, { lastRequest: number; requestCount: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function applyRateLimit(ip: string) {
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip) || { lastRequest: now, requestCount: 0 };

    if (now - rateLimitData.lastRequest > RATE_LIMIT_WINDOW) {
        // Reset the window
        rateLimitMap.set(ip, { lastRequest: now, requestCount: 1 });
        return true;
    }

    if (rateLimitData.requestCount >= MAX_REQUESTS) {
        return false;
    }

    rateLimitMap.set(ip, {
        lastRequest: now,
        requestCount: rateLimitData.requestCount + 1,
    });

    return true;
}

export async function POST(request: Request) {
    try {
        // Extract the user's IP address from the headers
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // Apply custom rate limiting
        if (!applyRateLimit(ip)) {
            return NextResponse.json(
                { message: 'Too many requests, please try again later.' },
                { status: 429 }
            );
        }

        await dbConnect();
        const { email } = await request.json();

        if (!email) {
            console.log('Forgot password: Email not provided');
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'If the email exists, a verification code has been sent.' },
                { status: 200 }
            );
        }

        const tempCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        user.tempPasswordResetCode = tempCode;
        user.tempCodeExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        try {
            await sendVerificationEmail(user.email, tempCode);
        } catch (error) {
            console.error(`Forgot password: Error sending verification email to ${email}:`, error);
            return NextResponse.json(
                { message: 'Error sending verification email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'If the email exists, a verification code has been sent.',
        });
    } catch (error) {
        console.error('Forgot password: Unexpected error:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}