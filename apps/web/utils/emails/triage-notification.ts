import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.MEDFLOW_SENDGRID_KEY || "");

const getEnvironmentLabel = () => {
    const env = process.env.NODE_ENV || "production";
    switch (env) {
        case "development":
            return "Development Environment";
        case "test":
            return "Staging / Test Environment";
        case "production":
        default:
            return ""; // No label for production
    }
};

export interface TriageUser {
    email: string;
    firstName: string;
    lastName: string;
}

export async function sendTriageNotification(
    users: TriageUser[],
    subject: string,
    message: string
) {
    try {
        const environmentLabel = getEnvironmentLabel();
        const senderEmail = process.env.GMAIL_SENDER_EMAIL;

        if (!senderEmail) {
            throw new Error("GMAIL_SENDER_EMAIL is not defined in the environment variables.");
        }

        const emails = users.map((user) => ({
            to: user.email,
            from: senderEmail,
            subject: environmentLabel ? `[${environmentLabel}] ${subject}` : subject,
            html: `
            <div style="font-family: Arial, sans-serif;">
                <h3>Hello ${user.firstName} ${user.lastName},</h3>
                <p>${message}</p>
                ${
                environmentLabel
                    ? `<p style="color: gray; font-size: 0.9em;">This email was sent from the ${environmentLabel}.</p>`
                    : ""
            }
            </div>
          `,
        }));

        await sgMail.send(emails);
        console.log(`Triage notification email sent to ${users.length} recipients.`);
    } catch (error) {
        console.error("Error sending Triage notification email:", error);
        throw error;
    }
}