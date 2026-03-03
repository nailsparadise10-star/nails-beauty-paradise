/**
 * Reminder Service for sending booking reminders to customers
 * Sends email reminders 24 hours before scheduled appointments
 */

import { ENV } from "./_core/env";
import * as db from "./db";
import { sendEmail } from "./email";

interface ReminderEmailData {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  phone: string;
  location: string;
}

/**
 * Generate reminder email HTML
 */
export function generateReminderEmailHTML(data: ReminderEmailData): string {
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f0;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #1B5E6F 0%, #2a7a8f 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 24px;
            color: #1A1A1A;
          }
          .reminder-box {
            background-color: #fff3cd;
            border-left: 4px solid #D4AF37;
            padding: 20px;
            margin: 24px 0;
            border-radius: 8px;
            border: 1px solid #ffeaa7;
          }
          .reminder-box strong {
            color: #1B5E6F;
          }
          .booking-details {
            background-color: #f5f5f0;
            border-left: 4px solid #D4AF37;
            padding: 20px;
            margin: 24px 0;
            border-radius: 8px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #1B5E6F;
            min-width: 120px;
          }
          .detail-value {
            color: #333;
            text-align: right;
          }
          .contact-info {
            background-color: #f5f5f0;
            padding: 20px;
            border-radius: 8px;
            margin: 24px 0;
            font-size: 14px;
          }
          .contact-info p {
            margin: 8px 0;
          }
          .contact-info strong {
            color: #1B5E6F;
          }
          .footer {
            background-color: #f5f5f0;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          .cta-button {
            display: inline-block;
            background-color: #D4AF37;
            color: #1B5E6F;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 24px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🔔 NAILS & BEAUTY PARADISE</h1>
            <p>Appointment Reminder</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">
              <p>Hi <strong>${data.customerName}</strong>,</p>
              <p>This is a friendly reminder about your upcoming appointment with us tomorrow!</p>
            </div>

            <!-- Reminder Alert -->
            <div class="reminder-box">
              <strong>⏰ Your appointment is tomorrow!</strong><br>
              Please arrive 5-10 minutes early. If you need to reschedule or cancel, please contact us as soon as possible.
            </div>

            <!-- Booking Details -->
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value"><strong>${data.serviceName}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value"><strong>${formattedDate}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value"><strong>${data.time}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value"><strong>${data.location}</strong></span>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
              <p><strong>📍 Location:</strong><br>
              47 Vulture Street, West End<br>
              QLD 4101, Australia</p>

              <p><strong>📞 Contact Us:</strong><br>
              Phone: +61 434 188 999<br>
              Email: suport@nailsparadise.com</p>

              <p><strong>🕐 Hours:</strong><br>
              Sun: 10:00am - 4:00pm<br>
              Mon-Sat: 8:30am - 9:30pm</p>
            </div>

            <div class="divider"></div>

            <p style="font-size: 14px; color: #666;">
              If you need to reschedule or have any questions, please contact us immediately. We look forward to seeing you!
            </p>

            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Best regards,<br>
              <strong>NAILS & BEAUTY PARADISE Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2026 NAILS & BEAUTY PARADISE. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this address.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send reminder email to customer
 */
export async function sendReminderEmail(data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  phone: string;
}): Promise<boolean> {
  const html = generateReminderEmailHTML({
    customerName: data.customerName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    phone: data.phone,
    location: "47 Vulture Street, West End, QLD 4101",
  });

  return sendEmail({
    to: data.customerEmail,
    subject: `Reminder: Your appointment tomorrow at NAILS & BEAUTY PARADISE`,
    html,
  });
}

/**
 * Process all reminders for bookings happening tomorrow
 * This should be called once per day (e.g., via cron job at 10 AM)
 */
export async function processDailyReminders(): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  const result = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    // Get all bookings for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const tomorrowDateStr = tomorrow.toISOString().split("T")[0];

    console.log(`[Reminder] Processing reminders for ${tomorrowDateStr}`);

    // Get all bookings from database
    const allBookings = await db.getAllBookings();

    // Filter bookings for tomorrow
    const tomorrowBookings = allBookings.filter((booking) => {
      const bookingDate = booking.date.split("T")[0];
      return bookingDate === tomorrowDateStr && booking.status !== "cancelled";
    });

    console.log(`[Reminder] Found ${tomorrowBookings.length} bookings for tomorrow`);

    // Send reminders
    for (const booking of tomorrowBookings) {
      try {
        const success = await sendReminderEmail({
          customerName: booking.name,
          customerEmail: booking.email,
          serviceName: booking.service,
          date: booking.date,
          time: booking.time || "To be confirmed",
          phone: booking.phone,
        });

        if (success) {
          result.sent++;
          console.log(`[Reminder] Sent reminder to ${booking.email}`);
        } else {
          result.failed++;
          result.errors.push(`Failed to send reminder to ${booking.email}`);
        }
      } catch (error) {
        result.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Error sending reminder to ${booking.email}: ${errorMsg}`);
        console.error(`[Reminder] Error sending reminder to ${booking.email}:`, error);
      }
    }

    console.log(
      `[Reminder] Daily reminder processing complete. Sent: ${result.sent}, Failed: ${result.failed}`
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(`Fatal error during reminder processing: ${errorMsg}`);
    console.error("[Reminder] Fatal error during reminder processing:", error);
  }

  return result;
}
