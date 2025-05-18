import { Event, Attendee } from "./eventService";
import { notifyAllAttendees, sendRSVPConfirmation, sendCheckInReminder, sendPostEventThankYou } from "./notificationService";

/**
 * Send RSVP confirmation email
 * @param event - The event object
 * @param attendee - The attendee who RSVPed
 */
export const sendRSVPConfirmationEmail = async (
event: Event,
attendee: Attendee)
: Promise<boolean> => {
  try {
    const { error } = await window.ezsite.apis.sendEmail({
      from: 'support@ezsite.ai',
      to: [attendee.email],
      subject: `You're confirmed for ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Event Confirmation</h2>
          <p>Dear ${attendee.name},</p>
          <p>Your RSVP for "${event.title}" has been confirmed!</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Event Details</h3>
            <p><strong>Date:</strong> ${new Date(event.startTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()} (${event.timezone})</p>
            <p><strong>Location:</strong> ${event.isVirtual ? 'Virtual Event' : event.location}</p>
            ${event.isVirtual ? `<p><strong>Link:</strong> <a href="${event.location}">${event.location}</a></p>` : ''}
          </div>
          
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>EventPulse Team</p>
        </div>
      `
    });

    if (error) {
      console.error("Error sending RSVP confirmation:", error);
      // Fallback to mock implementation for development
      return await sendRSVPConfirmation(event, attendee);
    }

    return true;
  } catch (error) {
    console.error("Error in sendRSVPConfirmationEmail:", error);
    // Fallback to mock implementation for development
    return await sendRSVPConfirmation(event, attendee);
  }
};

/**
 * Send check-in reminder email (1 hour before event)
 * @param event - The event object
 * @param attendee - The attendee to notify
 */
export const sendCheckInReminderEmail = async (
event: Event,
attendee: Attendee)
: Promise<boolean> => {
  try {
    const { error } = await window.ezsite.apis.sendEmail({
      from: 'support@ezsite.ai',
      to: [attendee.email],
      subject: `Check-in now open for ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Event Starting Soon</h2>
          <p>Dear ${attendee.name},</p>
          <p>The event "${event.title}" is starting soon!</p>
          <p><strong>Check-in is now open.</strong> Please check in to confirm your attendance.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Event Details</h3>
            <p><strong>Date:</strong> ${new Date(event.startTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()} (${event.timezone})</p>
            <p><strong>Location:</strong> ${event.isVirtual ? 'Virtual Event' : event.location}</p>
            ${event.isVirtual ? `<p><strong>Link:</strong> <a href="${event.location}">${event.location}</a></p>` : ''}
          </div>
          
          <div style="background-color: #4f46e5; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block;">
            <a href="/events/${event.id}" style="color: white; text-decoration: none;">Check in Now</a>
          </div>
          
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>EventPulse Team</p>
        </div>
      `
    });

    if (error) {
      console.error("Error sending check-in reminder:", error);
      // Fallback to mock implementation for development
      return await sendCheckInReminder(event, attendee);
    }

    return true;
  } catch (error) {
    console.error("Error in sendCheckInReminderEmail:", error);
    // Fallback to mock implementation for development
    return await sendCheckInReminder(event, attendee);
  }
};

/**
 * Send post-event thank you email
 * @param event - The event object
 * @param attendee - The attendee who attended
 */
export const sendPostEventThankYouEmail = async (
event: Event,
attendee: Attendee)
: Promise<boolean> => {
  try {
    const { error } = await window.ezsite.apis.sendEmail({
      from: 'support@ezsite.ai',
      to: [attendee.email],
      subject: `Thanks for attending ${event.title}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You for Attending</h2>
          <p>Dear ${attendee.name},</p>
          <p>Thank you for attending "${event.title}"!</p>
          <p>We hope you enjoyed the event. Your feedback is valuable to us.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Event Summary</h3>
            <p>Check out the event summary and analytics in your dashboard.</p>
          </div>
          
          <div style="background-color: #4f46e5; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block;">
            <a href="/events/${event.id}" style="color: white; text-decoration: none;">View Summary</a>
          </div>
          
          <p>We hope to see you at future events!</p>
          <p>Best regards,<br>EventPulse Team</p>
        </div>
      `
    });

    if (error) {
      console.error("Error sending post-event thank you:", error);
      // Fallback to mock implementation for development
      return await sendPostEventThankYou(event, attendee);
    }

    return true;
  } catch (error) {
    console.error("Error in sendPostEventThankYouEmail:", error);
    // Fallback to mock implementation for development
    return await sendPostEventThankYou(event, attendee);
  }
};

/**
 * Send notification emails to all attendees of an event
 * @param event - The event object
 * @param type - Type of notification to send
 */
export const notifyAllAttendeesEmail = async (
event: Event,
type: "checkin_reminder" | "post_event_thanks")
: Promise<boolean> => {
  try {
    let success = true;
    for (const attendee of event.attendees) {
      let result = false;
      if (type === "checkin_reminder") {
        result = await sendCheckInReminderEmail(event, attendee);
      } else if (type === "post_event_thanks") {
        result = await sendPostEventThankYouEmail(event, attendee);
      }
      success = success && result;
    }
    return success;
  } catch (error) {
    console.error("Error sending notifications to all attendees:", error);
    // Fallback to mock implementation
    return await notifyAllAttendees(event, type);
  }
};