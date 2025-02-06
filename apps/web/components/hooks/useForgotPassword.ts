// components/hooks/useForgotPassword.ts
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emails/forgot-password';
import User from '@/models/user';
import crypto from 'crypto';
import dbConnect from "@/utils/database";
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

// Create a rate limiter instance
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware to adapt Next.js API route to express-style middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: Error | unknown) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Apply rate limiting
        await runMiddleware(req, res, limiter);

        await dbConnect();

        // Parse the request body
        const body = await new Promise<{ email: string }>((resolve) => {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        const { email } = body;

        if (!email) {
            console.log('Forgot password: Email not provided');
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If the email exists, a verification code has been sent.' });
        }

        const tempCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        user.tempPasswordResetCode = tempCode;
        user.tempCodeExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        try {
            await sendVerificationEmail(user.email, tempCode);
        } catch (error) {
            console.error(`Forgot password: Error sending verification email to ${email}:`, error);
            return res.status(500).json({ message: 'Error sending verification email' });
        }

        return res.status(200).json({ message: 'If the email exists, a verification code has been sent.' });
    } catch (error) {
        if (error instanceof Error && error.message === 'Too many requests, please try again later.') {
            return res.status(429).json({ message: error.message });
        }
        console.error('Forgot password: Unexpected error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
}