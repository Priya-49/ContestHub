// pages/api/cron/check-reminders.ts
import type { NextApiRequest, NextApiResponse } from 'next';

import { checkAndSendReminders } from '../../../scripts/sendReminders'; 

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse 
) {

  if (
    req.headers['x-vercel-cron-event'] !== 'true' || 
    req.headers['x-api-key'] !== process.env.CRON_API_KEY 
  ) {
    console.warn('❌ Unauthorized access attempt to cron endpoint.');
    return res.status(401).json({ message: 'Unauthorized access.' });
  }


  console.log(`🚀 [Vercel Cron] Starting reminder check via API at ${new Date().toISOString()}`);

  try {
    await checkAndSendReminders(); // Call your main reminder logic
    console.log("✅ [Vercel Cron] Reminder check completed successfully!");
    res.status(200).json({ message: 'Reminder check initiated successfully.' });
  } catch (error) {
    console.error("❌ [Vercel Cron] Reminder check failed:", error);
    res.status(500).json({ message: 'Internal Server Error during reminder check.'});
  }
}