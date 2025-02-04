// utils/emails/forgot-password.ts
import sgMail from '@sendgrid/mail';

// Set your SendGrid API Key
sgMail.setApiKey(process.env.MEDFLOW_SENDGRID_KEY || '');

const getEnvironmentLabel = () => {
    const env = process.env.NODE_ENV || 'production';
    switch (env) {
        case 'development':
            return 'Development Environment';
        case 'test':
            return 'Staging / test Environment';
        case 'production':
        default:
            return ''; // Do not include anything for production
    }
};

export const sendVerificationEmail = async (email: string | undefined, verificationCode: string) => {
    if (!email) {
        throw new Error('Email is required to send the verification email.');
    }

    try {
        const environmentLabel = getEnvironmentLabel();
        const senderEmail = process.env.GMAIL_SENDER_EMAIL || 'support@menahealth.org';

        const subject = environmentLabel
            ? `[${environmentLabel}] Password Reset Verification Code`
            : 'Password Reset Verification Code';

        const msg = {
            to: email,
            from: senderEmail,
            subject: subject,
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Password Reset Request</h3>
          <p>You have requested to reset your password. Please use the following verification code:</p>
          <h2 style="color: #4A90E2;">${verificationCode}</h2>
          <p>This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          ${environmentLabel ? `<p style="color: gray; font-size: 0.9em;">This email was sent from the ${environmentLabel}.</p>` : ''}
        </div>
      `,
        };

        await sgMail.send(msg);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error sending verification email:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

// Separate test function
export const testVerificationEmail = async () => {
    if (process.env.NODE_ENV === 'development') {
        const testEmail = 'test@example.com';
        const testCode = '123456';
        await sendVerificationEmail(testEmail, testCode);
        console.log('Test verification email sent successfully');
    } else {
        console.log('Test emails are only sent in development environment');
    }
};

