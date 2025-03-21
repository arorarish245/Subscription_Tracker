import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
  console.log(`📧 sendReminderEmail called with: To=${to}, Type=${type}`);

  if (!to || !type) {
    console.error('❌ Missing required parameters');
    return;
  }

  console.log(`🔍 Looking for email template: ${type}`);
  const template = emailTemplates.find((t) => t.label === type);
  if (!template) {
    console.error(`❌ No email template found for type: ${type}`);
    return;
  }

  console.log('✅ Email template found! Proceeding to send...');

  const mailInfo = {
    userName: subscription.user?.name || "Unknown User",
    subscriptionName: subscription.name || "Unknown Subscription",
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    price: `${subscription.currency || "USD"} ${subscription.price || "0.00"} (${subscription.frequency || "Unknown"})`,
    paymentMethod: subscription.paymentMethod || "Unknown",
  };

  console.log('📧 Generated email info:', mailInfo);

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  console.log(`📩 Email subject: ${subject}`);
  console.log(`📜 Email body preview: ${message.substring(0, 100)}...`); // Print first 100 chars

  const mailOptions = {
    from: accountEmail,
    to,  // <- Ensure the correct recipient is used
    subject,
    html: message,
  };

  console.log('🚀 Attempting to send email...');

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
