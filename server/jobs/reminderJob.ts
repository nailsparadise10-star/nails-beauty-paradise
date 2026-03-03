/**
 * Cron Job: Daily Booking Reminders
 * Runs every day at 10:00 AM to send reminder emails for bookings tomorrow
 * 
 * Schedule: 0 10 * * * (10:00 AM every day)
 */

import { processDailyReminders } from "../reminder";

export async function runDailyReminderJob() {
  console.log("[ReminderJob] Starting daily reminder job...");
  
  try {
    const result = await processDailyReminders();
    
    console.log("[ReminderJob] Job completed:");
    console.log(`  - Reminders sent: ${result.sent}`);
    console.log(`  - Reminders failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log("[ReminderJob] Errors:");
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }
    
    return result;
  } catch (error) {
    console.error("[ReminderJob] Fatal error:", error);
    throw error;
  }
}

// Export for manual testing
export default runDailyReminderJob;
