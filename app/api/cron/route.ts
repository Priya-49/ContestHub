import { NextResponse } from 'next/server';
import { checkAndSendReminders } from '@/scripts/sendReminders';

export async function GET() {
  try {
    await checkAndSendReminders();
    return NextResponse.json({ success: true, message: "Reminders checked and sent." });
  } catch (error) {
    console.error("❌ Cron route failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
