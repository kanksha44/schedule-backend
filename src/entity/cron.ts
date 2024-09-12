import cron from 'node-cron';
import { AppDataSource } from "../Connection/data-source";
import { Sms } from './Sms';
import { sendMessage as sendTwilioMessage } from "./twilioClient";
import { User } from './Schema/User';




cron.schedule('* * * * *', async () => { 
    const smsRepository = AppDataSource.getRepository(Sms);
  // Find SMS messages that are scheduled for now or in the past and have not been sent yet
  const smsToSend = await smsRepository
    .createQueryBuilder('sms')
    .where('scheduledAt <= NOW() AND sentAt IS NULL')
    .getMany();

  for (const sms of smsToSend) {
    // Fetch the user information to get the phone number
    // Assuming you have a User entity and repository
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne(sms.userId);

    if (user) {
      try {
        await sendTwilioMessage(user.phoneNumber, sms.text);
        sms.sentAt = new Date(); // Mark as sent
        await smsRepository.save(sms); // Update the SMS record
      } catch (error) {
        console.error('Failed to send message:', error);
        // Optionally, handle the error (e.g., retry or log)
      }
    }
  }
});
