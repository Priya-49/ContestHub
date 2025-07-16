const cron = require('node-cron');
const { checkAndSendReminders } = require('../scripts/sendReminders');

cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Running cron job...");
  await checkAndSendReminders();
});


