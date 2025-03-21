import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

// ✅ Extend Day.js with isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log(`📡 Fetching subscription for ID: ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== 'active') {
    console.log(`⏸️ Subscription ${subscriptionId} is not active. Stopping.`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  console.log(`📆 Subscription renewal date: ${renewalDate.format('YYYY-MM-DD')}`);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`⏳ Renewal date has already passed. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    console.log(`📅 Checking reminder for ${daysBefore} days before renewal...`);
    
    // Fix: Use isSameOrAfter correctly
    if (dayjs().isSameOrAfter(reminderDate, 'day')) {
      console.log(`🚀 Triggering ${daysBefore}-day reminder email now.`);
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    } else {
      console.log(`⏳ Sleeping until reminder date (${reminderDate.format('YYYY-MM-DD')})`);
      await sleepUntilReminder(context, `${daysBefore} days before`, reminderDate);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`⏳ Sleeping until ${label} at ${date.format('YYYY-MM-DD HH:mm:ss')}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  console.log(`🚀 About to trigger reminder: ${label}`);

  return await context.run(label, async () => {
    console.log(`📡 Triggering ${label} for ${subscription.user.email}`);

    try {
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
      console.log(`✅ Reminder email sent successfully: ${label}`);
    } catch (error) {
      console.error(`❌ Error while sending reminder email for ${label}:`, error);
    }
  });
};

