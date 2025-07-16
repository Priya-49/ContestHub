import { checkAndSendReminders } from "../scripts/sendReminders"

async function runCronJob() {
  try {
    console.log("🚀 Starting cron job to send reminders...")
    await checkAndSendReminders()
    console.log("✅ Reminders sent successfully!")
  } catch (error) {
    console.error("❌ Cron job failed:", error)
    process.exit(1)
  }
}

runCronJob()

