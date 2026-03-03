/**
 * Email Service for sending booking confirmations and notifications
 * Uses Manus built-in notification API with email delivery
 */

import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";

const BUILT_IN_FORGE_API_URL = ENV.forgeApiUrl;
const BUILT_IN_FORGE_API_KEY = ENV.forgeApiKey;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Manus built-in notification service
 * This uses the owner notification system which supports email delivery
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    if (!BUILT_IN_FORGE_API_URL || !BUILT_IN_FORGE_API_KEY) {
      console.warn("[Email] API credentials not configured");
      return false;
    }

    // Use Manus notification API which supports email delivery
    const response = await fetch(`${BUILT_IN_FORGE_API_URL}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BUILT_IN_FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        to: payload.to,
        title: payload.subject,
        content: payload.html,
        type: "email",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Email] Failed to send email:", response.status, errorText);
      return false;
    }

    console.log(`[Email] Sent to ${payload.to}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Generate booking confirmation email HTML
 */
export function generateBookingConfirmationEmail(data: {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  bookingId: string;
  phone: string;
  notes?: string;
}): string {
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
          .booking-id {
            background-color: #1B5E6F;
            color: #ffffff;
            padding: 12px 16px;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
          }
          .info-box {
            background-color: #f0f8ff;
            border: 1px solid #1B5E6F;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #333;
          }
          .info-box strong {
            color: #1B5E6F;
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
            <h1>✨ NAILS & BEAUTY PARADISE</h1>
            <p>Your Booking Confirmation</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">
              <p>Hi <strong>${data.customerName}</strong>,</p>
              <p>Thank you for booking with us! We're excited to see you soon. Your appointment has been confirmed and we'll provide you with excellent service.</p>
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
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><strong>${data.phone}</strong></span>
              </div>
            </div>

            <!-- Booking ID -->
            <div class="booking-id">
              Booking ID: ${data.bookingId}
            </div>

            <!-- Important Info -->
            <div class="info-box">
              <strong>📌 Important:</strong><br>
              Please arrive 5-10 minutes early. If you need to reschedule or cancel, please contact us as soon as possible.
            </div>

            ${
              data.notes
                ? `
              <div class="info-box">
                <strong>📝 Your Special Requests:</strong><br>
                ${data.notes}
              </div>
            `
                : ""
            }

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
              If you have any questions or need to make changes to your booking, please don't hesitate to contact us. We look forward to seeing you!
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
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  bookingId: string;
  phone: string;
  notes?: string;
}): Promise<boolean> {
  const html = generateBookingConfirmationEmail({
    customerName: data.customerName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    bookingId: data.bookingId,
    phone: data.phone,
    notes: data.notes,
  });

  return sendEmail({
    to: data.customerEmail,
    subject: `Booking Confirmation - NAILS & BEAUTY PARADISE (ID: ${data.bookingId})`,
    html,
  });
}
