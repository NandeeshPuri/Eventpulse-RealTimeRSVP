import { Event, Attendee } from "./eventService";

// Mock function to send an email notification for RSVP confirmation
export const sendRSVPConfirmation = async (event: Event, attendee: Attendee): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    console.log(`[MOCK EMAIL] To: ${attendee.email}, Subject: You're confirmed for ${event.title}`);
    console.log(`Email body: 
      Dear ${attendee.name},
      
      Your RSVP for "${event.title}" has been confirmed!
      
      Event Details:
      Date: ${new Date(event.startTime).toLocaleDateString()}
      Time: ${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()} (${event.timezone})
      Location: ${event.location}
      
      We look forward to seeing you there!
      
      Best regards,
      EventPulse Team
    `);

    return true;
  } catch (error) {
    console.error("Error sending RSVP confirmation:", error);
    return false;
  }
};

// Mock function to send a check-in reminder
export const sendCheckInReminder = async (event: Event, attendee: Attendee): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    console.log(`[MOCK EMAIL] To: ${attendee.email}, Subject: Check-in now open for ${event.title}`);
    console.log(`Email body: 
      Dear ${attendee.name},
      
      The event "${event.title}" is starting soon!
      
      Check-in is now open. Please check in to confirm your attendance.
      
      Event Details:
      Date: ${new Date(event.startTime).toLocaleDateString()}
      Time: ${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()} (${event.timezone})
      Location: ${event.location}
      
      We look forward to seeing you there!
      
      Best regards,
      EventPulse Team
    `);

    return true;
  } catch (error) {
    console.error("Error sending check-in reminder:", error);
    return false;
  }
};

// Mock function to send post-event thank you
export const sendPostEventThankYou = async (event: Event, attendee: Attendee): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    console.log(`[MOCK EMAIL] To: ${attendee.email}, Subject: Thanks for attending ${event.title}!`);
    console.log(`Email body: 
      Dear ${attendee.name},
      
      Thank you for attending "${event.title}"!
      
      We hope you enjoyed the event. Your feedback is valuable to us.
      Please take a moment to view the event summary and share your thoughts.
      
      Best regards,
      EventPulse Team
    `);

    return true;
  } catch (error) {
    console.error("Error sending post-event thank you:", error);
    return false;
  }
};

// Helper function to send notification emails to all attendees of an event
export const notifyAllAttendees = async (
event: Event,
type: "checkin_reminder" | "post_event_thanks")
: Promise<boolean> => {
  try {
    for (const attendee of event.attendees) {
      if (type === "checkin_reminder") {
        await sendCheckInReminder(event, attendee);
      } else if (type === "post_event_thanks") {
        await sendPostEventThankYou(event, attendee);
      }
    }
    return true;
  } catch (error) {
    console.error("Error sending notifications to all attendees:", error);
    return false;
  }
};