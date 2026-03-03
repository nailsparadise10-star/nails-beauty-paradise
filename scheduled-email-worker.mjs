import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0],
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0],
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0],
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0],
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

async function sendScheduledEmails() {
  const connection = await pool.getConnection();
  try {
    // Get all pending scheduled emails that are ready to send
    const [emails] = await connection.query(
      `SELECT * FROM scheduled_emails 
       WHERE status = 'pending' 
       AND scheduled_at <= NOW()
       LIMIT 10`
    );

    console.log(`Found ${emails.length} emails to send`);

    for (const email of emails) {
      try {
        // Send email via Manus notification API
        const response = await fetch(process.env.BUILT_IN_FORGE_API_URL + '/notification/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email.customerEmail,
            subject: email.subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1B5E6F;">${email.subject}</h2>
                <p>${email.message}</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                  This is an automated message from NAILS & BEAUTY PARADISE
                </p>
              </div>
            `,
          }),
        });

        if (response.ok) {
          // Update status to sent
          await connection.query(
            `UPDATE scheduled_emails 
             SET status = 'sent', sent_at = NOW() 
             WHERE id = ?`,
            [email.id]
          );
          console.log(`Email ${email.id} sent successfully to ${email.customerEmail}`);
        } else {
          // Update status to failed
          await connection.query(
            `UPDATE scheduled_emails 
             SET status = 'failed', error_message = ? 
             WHERE id = ?`,
            [`HTTP ${response.status}`, email.id]
          );
          console.error(`Failed to send email ${email.id}: HTTP ${response.status}`);
        }
      } catch (error) {
        // Update status to failed with error message
        await connection.query(
          `UPDATE scheduled_emails 
           SET status = 'failed', error_message = ? 
           WHERE id = ?`,
          [error.message, email.id]
        );
        console.error(`Error sending email ${email.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in scheduled email worker:', error);
  } finally {
    connection.release();
  }
}

// Run every minute
setInterval(sendScheduledEmails, 60000);

// Run immediately on start
sendScheduledEmails();

console.log('Scheduled email worker started. Checking for emails every minute...');
