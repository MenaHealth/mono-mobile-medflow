// utils/emails/user-approval.ts

import sgMail from '@sendgrid/mail';

// Ensure the SendGrid API key is set
if (!process.env.MEDFLOW_SENDGRID_KEY) {
    console.error('MEDFLOW_SENDGRID_KEY is not set in the environment variables');
    process.exit(1);
}

sgMail.setApiKey(process.env.MEDFLOW_SENDGRID_KEY);

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

export const sendApprovalEmail = async (email: string, firstName: string, lastName: string, accountType: string) => {
    try {
        const environmentLabel = getEnvironmentLabel();
        const senderEmail = process.env.GMAIL_SENDER_EMAIL;

        if (!senderEmail) {
            throw new Error('GMAIL_SENDER_EMAIL is not defined in the environment variables.');
        }

        let greeting;
        if (accountType === 'Doctor') {
            greeting = `Hello Dr. ${lastName},`;
        } else {
            greeting = `Hello ${firstName},`;
        }

        const subject = environmentLabel ? `[${environmentLabel}] Account Approved - MedFlow` : 'Account Approved - MedFlow';

        const msg = {
            to: email,
            from: senderEmail,
            subject: subject,
            html: `
        <div style="background-color: #120f0b; padding: 20px; color: #ffffff;">
          <h3 style="color: #ff5722; background-color: #ffffff; padding: 10px 20px; border-radius: 5px;">
            ${greeting}
          </h3>
          <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">
            Your account has been approved! You can now log in to your MedFlow account.<br><br>
            Click the link below to log in:<br>
            <a href="https://medflow-mena-health.vercel.app/auth/login" style="color: #ff5722;">Login to MedFlow</a><br><br>
            If you have any questions or need assistance, feel free to reach out to our support team.<br><br>
            <strong>Best regards,</strong><br>
            <strong>The MedFlow Team</strong>
          </p>
          ${environmentLabel ? `<p style="color: gray; font-size: 0.9em;">This email was sent from the ${environmentLabel}.</p>` : ''}
        </div>
      `,
        };

        await sgMail.send(msg);
        console.log(`Approval email sent successfully to: ${email}`);
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

// Separate test function
export const testApprovalEmail = async () => {
    if (process.env.NODE_ENV === 'development') {
        const testEmail = 'test@example.com';
        await sendApprovalEmail(testEmail, 'John', 'Doe', 'Doctor');
        console.log('Test approval email sent successfully');
    } else {
        console.log('Test emails are only sent in development environment');
    }
};

