// import cron from 'node-cron';
// import { AppDataSource } from "../Connection/data-source";
// import { Sms } from './Sms';
// import { sendMessage as sendTwilioMessage } from "./twilioClient";
// import { User } from './Schema/User';




// cron.schedule('* * * * *', async () => { 
//     const smsRepository = AppDataSource.getRepository(Sms);
//   const smsToSend = await smsRepository
//     .createQueryBuilder('sms')
//     .where('scheduledAt <= NOW() AND sentAt IS NULL')
//     .getMany();

//   for (const sms of smsToSend) {

//     const userRepository = AppDataSource.getRepository(User);
//     const user = await userRepository.findOne(sms.userId);

//     if (user) {
//       try {
//         await sendTwilioMessage(user.phoneNumber, sms.text);
//         sms.sentAt = new Date(); 
//         await smsRepository.save(sms); 
//       } catch (error) {
//         console.error('Failed to send message:', error);
//       }
//     }
//   }
// });
