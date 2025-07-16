import cron from 'node-cron';
import { checkAndSendReminders } from '../scripts/sendRemainders';

cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Running cron job...");
  await checkAndSendReminders();
});

