import { Event } from "../services/eventService";
import {
  sendPostEventThankYouEmail,
  notifyAllAttendeesEmail } from
"../services/emailNotificationService";

/**
 * Send post-event thank you emails to all attendees
 * @param event - The event that has ended
 */
export const sendPostEventNotifications = async (event: Event): Promise<boolean> => {
  try {
    // Send to all attendees who checked in
    const checkedInAttendees = event.attendees.filter((a) => a.attended);

    // Send individual emails for checked-in attendees
    for (const attendee of checkedInAttendees) {
      await sendPostEventThankYouEmail(event, attendee);
    }

    return true;
  } catch (error) {
    console.error("Error sending post-event notifications:", error);
    return false;
  }
};

/**
 * Send check-in reminder emails to all attendees
 * This would typically be triggered by a scheduler/cron job
 * @param event - The event that is about to start
 */
export const sendCheckInReminders = async (event: Event): Promise<boolean> => {
  try {
    return await notifyAllAttendeesEmail(event, "checkin_reminder");
  } catch (error) {
    console.error("Error sending check-in reminders:", error);
    return false;
  }
};