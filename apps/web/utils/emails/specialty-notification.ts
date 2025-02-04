// utils/emails/specialty-notification.ts
import sgMail from '@sendgrid/mail';

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

export interface Doctor {
    email: string;
    firstName: string;
    lastName: string;
    doctorSpecialty: string[];
}

export async function sendSpecialtyNotification(
    doctors: Doctor[],
    subject: string,
    message: string,
    patientCountry: string
) {    try {
        const environmentLabel = getEnvironmentLabel();
        const senderEmail = process.env.GMAIL_SENDER_EMAIL;

        if (!senderEmail) {
            throw new Error('GMAIL_SENDER_EMAIL is not defined in the environment variables.');
        }

        const emails = doctors.map(doctor => ({
            to: doctor.email,
            from: senderEmail,
            subject: environmentLabel ? `[${environmentLabel}] ${subject}` : subject,
            html: `
            <div style="font-family: Arial, sans-serif;">
                <h3>Hello Dr. ${doctor.lastName},</h3>
                <h4>${subject}</h4>
                <p>${message}</p>
                <p><strong>Specialties:</strong> ${doctor.doctorSpecialty?.join(", ") || "Not specified"}</p>
                <p><strong>Patient Country:</strong> ${patientCountry}</p>
                ${environmentLabel ? `<p style="color: gray; font-size: 0.9em;">This email was sent from the ${environmentLabel}.</p>` : ''}
            </div>
        `,
        }));

        await sgMail.send(emails);
        console.log(`Specialty notification email sent to ${doctors.length} recipients.`);
    } catch (error) {
        console.error('Error sending specialty notification email:', error);
        throw error;
    }
}


