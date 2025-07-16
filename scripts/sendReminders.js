require('dotenv/config');
const mongoose = require('mongoose');
const { render } = require('@react-email/render');
const { Resend } = require('resend');

const { connectDB } = require('../lib/db');
const Notification = require('../lib/models/notification');
const ReminderEmail = require('../emails/RemainderEmail');

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in environment variables.");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReminderEmail(toEmail, contestName, contestDate, contestTime, notifyBefore, contestUrl) {
  const html = await render(
    ReminderEmail({
      contestName,
      contestDate,
      contestTime,
      notifyBefore,
      contestUrl,
    })
  );

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: toEmail,
      subject: `ContestHub Reminder: ${contestName} starting ${notifyBefore}!`,
      html,
    });

    console.log(`✅ Sent reminder to ${toEmail} for "${contestName}"`);
  } catch (error) {
    console.error(`❌ Failed to send reminder to ${toEmail} for "${contestName}":`, error);
  }
}

async function checkAndSendReminders() {
  console.log(`🔄 [Reminder Script] Starting check at ${new Date().toISOString()}`);
  await connectDB();

  try {
    const now = new Date();
    const notifications = await Notification.find({ reminderSent: false });

    for (const notification of notifications) {
      const combinedDateTimeString = `${notification.contestDate} ${notification.contestTime}`;
      const contestDateTime = new Date(combinedDateTimeString);

      if (isNaN(contestDateTime.getTime())) {
        console.warn(`⚠️ Invalid datetime for notification ID ${notification._id}. Skipping.`);
        continue;
      }

      let reminderOffsetMs = 0;
      const match = notification.notifyBefore.match(/(\d+)([mh])/);

      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        reminderOffsetMs = unit === "h" ? value * 60 * 60 * 1000 : value * 60 * 1000;
      } else {
        console.warn(`⚠️ Invalid notifyBefore format for ID ${notification._id}. Defaulting to 1 hour.`);
        reminderOffsetMs = 1 * 60 * 60 * 1000;
      }

      const reminderTime = new Date(contestDateTime.getTime() - reminderOffsetMs);
      const fiveMinutesWindow = 5 * 60 * 1000;

      if (
        now.getTime() >= reminderTime.getTime() &&
        now.getTime() <= reminderTime.getTime() + fiveMinutesWindow
      ) {
        console.log(`📩 Sending reminder for "${notification.contestName}" (ID: ${notification._id})`);

        await sendReminderEmail(
          notification.userEmail,
          notification.contestName,
          notification.contestDate,
          notification.contestTime,
          notification.notifyBefore,
          notification.contestUrl
        );

        await Notification.findByIdAndUpdate(notification._id, { reminderSent: true });
        console.log(`✅ Marked notification ID ${notification._id} as sent.`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking and sending reminders:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed.");
    }
    console.log(`🏁 Finished reminder check at ${new Date().toISOString()}`);
  }
}

module.expor

