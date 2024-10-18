import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function sendScheduledSms(body:string,to:string,sendAt:Date) {

    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    try {
        const message = await client.messages.create({
            from: messagingServiceSid,
            to,
            body,
            scheduleType: 'fixed',
            sendAt,
        });
    
        console.log(message.sid)
    } catch (error) {
        console.error("Failed to send twillo sms:", error);
        throw error;
    }
}
