
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emails/forgot-password';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: Request) {
    try {
        console.log('Received request to send password reset email.');

        const { userId } = await request.json();
        console.log('User ID from request body:', userId);

        await dbConnect();
        console.log('Database connected successfully.');

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found for ID:', userId);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('User found:', {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        console.log('Generated verification code:', verificationCode);

        // Save the verification code and expiration to the database
        user.verificationCode = verificationCode;
        user.verificationCodeExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();
        console.log('Verification code and expiration saved to database.');

        // Send the verification email
        console.log('Sending verification email to:', user.email);
        await sendVerificationEmail(user.email, verificationCode);
        console.log('Verification email sent successfully.');

        return NextResponse.json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error occurred while sending password reset email:', {
                message: error.message,
                stack: error.stack,
                details: error,
            });
        } else {
            console.error('Unknown error occurred:', error);
        }

        return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }
}