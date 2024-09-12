import { Request, Response } from "express";
import { AppDataSource } from "../Connection/data-source";
import { User } from "../entity/Schema/User";
import { Appointment } from "../entity/Schema/Appointment";
// import { sendMessage as sendTwilioMessage } from "../entity/twilioClient";
import { sendScheduledSms as sendTwilioMessage } from "../entity/schedulingSms";
import moment from "moment-timezone";

const userRepository = AppDataSource.getRepository(User);

export const CreateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, phoneNumber } = req.body;

  if (!name || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Name and phone number are required" });
  }

  //   const userRepository = AppDataSource.getRepository(User);

  try {
    const newUser = userRepository.create({ name, phoneNumber });
    await userRepository.save(newUser);
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Phone number already exists" });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    if (users.length === 0) {
      res.status(404).json({
        message: "no user found",
      });
    }
    res.status(200).json({
      message: "all users",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || error,
    });
  }
};

// export const sendMessage = async (req: Request, res: Response) => {
//   const { userId, text } = req.body;

//   console.log("Received userId:", userId);
//   try {
//     // const user = await userRepository.findOne(userId);
//     const user = await userRepository.findOne({ where: { id: userId } });

//     if (!user) {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     const sms = await sendTwilioMessage( text,user.phoneNumber);
//     console.log("user.phoneNumber", user.phoneNumber);
//     console.log("text", text);

//     res
//       .status(200)
//       .send({ success: true, message: "SMS sent successfully", data: sms });
//   } catch (error: any) {
//     console.error("Error sending SMS:", error);

//     res.status(500).send({
//       success: false,
//       message: "Failed to send SMS",
//       error: error.message,
//     });
//   }
// };



export const bookAppointment = async (req: Request, res: Response) => {
  const { name, phonenumber, smstosend, date, time } = req.body;

  if (!name || !phonenumber || !smstosend || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("phonenumber", phonenumber)
  console.log("date", date)
  console.log("time", time)
  try {
    // const scheduleDate = moment.utc(`${date}T${time}`); // Ensure it's in UTC
    const scheduleDate = moment.tz(`${date}T${time}`, "Asia/Kolkata").utc(); // Convert IST to UTC

    console.log("scheduleDate (in UTC):", scheduleDate.format());
    // Get the current time
    const now = moment.utc();
    console.log("now", now)

   // Check if the scheduled time is at least 15 minutes from now
   if (scheduleDate.diff(now, "seconds") < 900) {
    return res.status(400).json({
      error: "The scheduled time must be at least 15 minutes from now.",
    });
  }

  // Check if the scheduled time is more than 35 days in the future
  if (scheduleDate.diff(now, "seconds") > 3024000) {
    return res.status(400).json({
      error: "The scheduled time cannot be more than 35 days in the future.",
    });
  }

   // Format the date as required by Twilio: "[YYYY]-[MM]-[DD]T[HH]:[MM]:[SS]Z"
   const formattedSendAt = scheduleDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
   console.log('formattedSendAt:', formattedSendAt);
    
    await sendTwilioMessage(smstosend, phonenumber, new Date(formattedSendAt));
    console.log("sendAt", formattedSendAt);
    res.status(200).json({ message: "SMS scheduled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking appointment or scheduling SMS", error });
  }
};
