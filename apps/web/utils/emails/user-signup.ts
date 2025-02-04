// utils/emails/user-signup.ts
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

export const sendWelcomeEmail = async (email: string, firstName: string, lastName: string, accountType: string) => {
    try {
        const environmentLabel = getEnvironmentLabel();
        const senderEmail = process.env.GMAIL_SENDER_EMAIL;

        if (!senderEmail) {
            throw new Error('GMAIL_SENDER_EMAIL is not defined in the environment variables.');
        }

        let greeting;
        if (accountType === 'Doctor-Pending') {
            greeting = `Hello Dr. ${lastName},`;
        } else {
            greeting = `Hello ${firstName},`;
        }

        const subject = environmentLabel ? `[${environmentLabel}] Welcome to MedFlow` : 'Welcome to MedFlow';

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
            Thank you for signing up for MedFlow!<br><br>
            We're excited to have you on board. Your account has been created successfully.<br><br>
            Your account is pending administrator approval. You will receive a confirmation email once you've been authorized.<br><br>
            <strong>Best regards,</strong><br>
            <strong>The MedFlow Team</strong>
          </p>
          ${environmentLabel ? `<p style="color: gray; font-size: 0.9em;">This email was sent from the ${environmentLabel}.</p>` : ''}
        </div>
      `,
        };

        await sgMail.send(msg);
        console.log(`Welcome email sent successfully to: ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

// Separate test function
export const testWelcomeEmail = async () => {
    if (process.env.NODE_ENV === 'development') {
        const testEmail = 'test@example.com';
        await sendWelcomeEmail(testEmail, 'John', 'Doe', 'Doctor-Pending');
        console.log('Test welcome email sent successfully');
    } else {
        console.log('Test emails are only sent in development environment');
    }
};

