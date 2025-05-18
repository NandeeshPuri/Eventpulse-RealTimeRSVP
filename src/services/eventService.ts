import { User } from "../types/user";

export type Event = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  isVirtual: boolean;
  rsvpDeadline: string;
  maxAttendees: number;
  createdBy: string;
  status: "scheduled" | "live" | "closed";
  attendees: Attendee[];
  feedback: Feedback[];
};

export type Attendee = {
  id: string;
  userId: string;
  name: string;
  email: string;
  rsvpTime: string;
  checkInTime: string | null;
  attended: boolean;
};

export type Feedback = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  emoji: "👍" | "👎" | "❤️" | "😮" | null;
  timestamp: string;
  isPinned: boolean;
  isFlagged: boolean;
};

// Helper to get stored events from localStorage
const getStoredEvents = (): Event[] => {
  const events = localStorage.getItem("eventpulse_events");
  return events ? JSON.parse(events) : [];
};

// Helper to save events to localStorage
const saveEvents = (events: Event[]) => {
  localStorage.setItem("eventpulse_events", JSON.stringify(events));
};

// Helper to generate initial sample events if none exist
const initializeEvents = (userId: string): Event[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const events: Event[] = [
  {
    id: "event-1",
    title: "Tech Conference 2023",
    description: "Annual technology conference featuring the latest innovations and industry trends.",
    startTime: tomorrow.toISOString(),
    endTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    timezone: "America/New_York",
    location: "Convention Center, New York",
    isVirtual: false,
    rsvpDeadline: now.toISOString(),
    maxAttendees: 200,
    createdBy: userId,
    status: "scheduled",
    attendees: [],
    feedback: []
  },
  {
    id: "event-2",
    title: "Virtual Webinar: AI Trends",
    description: "Learn about the latest trends in artificial intelligence and machine learning.",
    startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    timezone: "UTC",
    location: "https://zoom.us/webinar/123",
    isVirtual: true,
    rsvpDeadline: new Date(now.getTime() + 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    maxAttendees: 500,
    createdBy: userId,
    status: "scheduled",
    attendees: [],
    feedback: []
  },
  {
    id: "event-3",
    title: "Past Networking Mixer",
    description: "An opportunity to network with professionals in your industry.",
    startTime: lastWeek.toISOString(),
    endTime: new Date(lastWeek.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    timezone: "America/Los_Angeles",
    location: "Downtown Hotel, Los Angeles",
    isVirtual: false,
    rsvpDeadline: new Date(lastWeek.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    maxAttendees: 100,
    createdBy: userId,
    status: "closed",
    attendees: [
    {
      id: "attendee-1",
      userId: "user-sample1",
      name: "John Doe",
      email: "john@example.com",
      rsvpTime: new Date(lastWeek.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      checkInTime: new Date(lastWeek.getTime() - 30 * 60 * 1000).toISOString(),
      attended: true
    },
    {
      id: "attendee-2",
      userId: "user-sample2",
      name: "Jane Smith",
      email: "jane@example.com",
      rsvpTime: new Date(lastWeek.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      checkInTime: new Date(lastWeek.getTime() - 15 * 60 * 1000).toISOString(),
      attended: true
    }],

    feedback: [
    {
      id: "feedback-1",
      userId: "user-sample1",
      userName: "John Doe",
      text: "Great networking opportunity!",
      emoji: "👍",
      timestamp: new Date(lastWeek.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      isPinned: true,
      isFlagged: false
    },
    {
      id: "feedback-2",
      userId: "user-sample2",
      userName: "Jane Smith",
      text: "Loved the speakers!",
      emoji: "❤️",
      timestamp: new Date(lastWeek.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
      isPinned: false,
      isFlagged: false
    }]

  }];


  saveEvents(events);
  return events;
};

// Update event statuses based on current time
const updateEventStatuses = (events: Event[]): Event[] => {
  const now = new Date();

  return events.map((event) => {
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (now > endTime) {
      return { ...event, status: "closed" };
    } else if (now >= startTime && now <= endTime) {
      return { ...event, status: "live" };
    } else {
      return { ...event, status: "scheduled" };
    }
  });
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  let events = getStoredEvents();

  // If no events exist, initialize with sample events for a demo user ID
  if (events.length === 0) {
    events = initializeEvents('demo-user-id');
  }

  events = updateEventStatuses(events);
  saveEvents(events);

  return events;
};

// Get events created by a specific user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  let events = getStoredEvents();

  // If no events exist, initialize with sample events
  if (events.length === 0) {
    events = initializeEvents(userId);
  }

  events = updateEventStatuses(events);
  saveEvents(events);

  return events.filter((event) => event.createdBy === userId);
};

// Get events that a user is attending
export const getAttendingEvents = async (userId: string): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  let events = getStoredEvents();
  events = updateEventStatuses(events);
  saveEvents(events);

  return events.filter((event) =>
  event.attendees.some((attendee) => attendee.userId === userId)
  );
};

// Get a single event by ID
export const getEventById = async (eventId: string): Promise<Event | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);

  if (!event) return null;

  // Update status if needed
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  let status = event.status;

  if (now > endTime) {
    status = "closed";
  } else if (now >= startTime && now <= endTime) {
    status = "live";
  } else {
    status = "scheduled";
  }

  const updatedEvent = { ...event, status };

  // If status changed, update in storage
  if (status !== event.status) {
    const updatedEvents = events.map((e) => e.id === eventId ? updatedEvent : e);
    saveEvents(updatedEvents);
  }

  return updatedEvent;
};

// Create a new event
export const createEvent = async (eventData: Omit<Event, "id" | "attendees" | "feedback" | "status">): Promise<Event> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

  const events = getStoredEvents();

  const newEvent: Event = {
    ...eventData,
    id: `event-${Math.random().toString(36).substring(2, 9)}`,
    status: "scheduled",
    attendees: [],
    feedback: []
  };

  events.push(newEvent);
  saveEvents(events);

  return newEvent;
};

// Update an existing event
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event | null> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) return null;

  // Don't allow updating certain fields
  const { id, createdBy, attendees, feedback, ...updateableData } = eventData as any;

  events[index] = { ...events[index], ...updateableData };
  saveEvents(events);

  return events[index];
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay

  const events = getStoredEvents();
  const filteredEvents = events.filter((e) => e.id !== eventId);

  if (filteredEvents.length === events.length) {
    return false; // Event wasn't found
  }

  saveEvents(filteredEvents);
  return true;
};

// Import sendRSVPConfirmationEmail from the email notification service
import { sendRSVPConfirmationEmail } from "./emailNotificationService";

// RSVP to an event
export const rsvpToEvent = async (eventId: string, userData: {userId: string;name: string;email: string;}): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) return false;

  const event = events[index];

  // Check if user has already RSVP'd
  if (event.attendees.some((a) => a.userId === userData.userId)) {
    return false;
  }

  // Check if event is at capacity
  if (event.attendees.length >= event.maxAttendees) {
    throw new Error("This event has reached maximum capacity");
  }

  // Check if RSVP deadline has passed
  if (new Date() > new Date(event.rsvpDeadline)) {
    throw new Error("The RSVP deadline has passed");
  }

  const newAttendee: Attendee = {
    id: `attendee-${Math.random().toString(36).substring(2, 9)}`,
    userId: userData.userId,
    name: userData.name,
    email: userData.email,
    rsvpTime: new Date().toISOString(),
    checkInTime: null,
    attended: false
  };

  events[index].attendees.push(newAttendee);
  saveEvents(events);

  // Send email notification for RSVP confirmation
  try {
    await sendRSVPConfirmationEmail(event, newAttendee);
  } catch (error) {
    console.error("Failed to send RSVP confirmation email:", error);
    // Continue even if email fails, as the RSVP itself succeeded
  }

  return true;
};

// Import email notification service
import { sendCheckInReminderEmail } from "./emailNotificationService";

// Check in to an event
export const checkInToEvent = async (eventId: string, userId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) return false;

  const event = events[index];
  const attendeeIndex = event.attendees.findIndex((a) => a.userId === userId);

  if (attendeeIndex === -1) return false;

  // Check if event is live
  const now = new Date();
  const startTime = new Date(event.startTime);
  const buffer = 60 * 60 * 1000; // 1 hour in milliseconds

  if (now < new Date(startTime.getTime() - buffer)) {
    throw new Error("Check-in is not yet available. It opens 1 hour before the event starts.");
  }

  events[index].attendees[attendeeIndex].checkInTime = now.toISOString();
  events[index].attendees[attendeeIndex].attended = true;
  saveEvents(events);

  // This would typically be triggered by a scheduler/cron job before the event
  // For demo purposes, we're calling it here to show the functionality
  try {
    // Send check-in confirmation (normally this would be sent 1hr before event)
    const attendee = events[index].attendees[attendeeIndex];
    await sendCheckInReminderEmail(event, attendee);
  } catch (error) {
    console.error("Failed to send check-in reminder email:", error);
    // Continue even if email fails, as the check-in itself succeeded
  }

  return true;
};

// Add a walk-in attendee (host only)
export const addWalkInAttendee = async (eventId: string, attendeeData: {name: string;email: string;}): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) return false;

  const newAttendee: Attendee = {
    id: `attendee-${Math.random().toString(36).substring(2, 9)}`,
    userId: `walkin-${Math.random().toString(36).substring(2, 9)}`,
    name: attendeeData.name,
    email: attendeeData.email,
    rsvpTime: new Date().toISOString(),
    checkInTime: new Date().toISOString(),
    attended: true
  };

  events[index].attendees.push(newAttendee);
  saveEvents(events);

  return true;
};

// Submit feedback for an event
export const submitFeedback = async (
eventId: string,
feedbackData: {userId: string;userName: string;text: string;emoji: "👍" | "👎" | "❤️" | "😮" | null;})
: Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === eventId);

  if (index === -1) return false;

  // Check if event is live or recently closed
  const event = events[index];
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const gracePeriod = new Date(endTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours after end

  if (now < startTime || now > gracePeriod) {
    throw new Error("Feedback can only be submitted during the event or within 24 hours after it ends");
  }

  const newFeedback: Feedback = {
    id: `feedback-${Math.random().toString(36).substring(2, 9)}`,
    userId: feedbackData.userId,
    userName: feedbackData.userName,
    text: feedbackData.text,
    emoji: feedbackData.emoji,
    timestamp: new Date().toISOString(),
    isPinned: false,
    isFlagged: false
  };

  events[index].feedback.push(newFeedback);
  saveEvents(events);

  return true;
};

// Pin or unpin feedback (host only)
export const togglePinFeedback = async (eventId: string, feedbackId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  const events = getStoredEvents();
  const eventIndex = events.findIndex((e) => e.id === eventId);

  if (eventIndex === -1) return false;

  const event = events[eventIndex];
  const feedbackIndex = event.feedback.findIndex((f) => f.id === feedbackId);

  if (feedbackIndex === -1) return false;

  events[eventIndex].feedback[feedbackIndex].isPinned = !events[eventIndex].feedback[feedbackIndex].isPinned;
  saveEvents(events);

  return true;
};

// Flag or unflag feedback as inappropriate (host only)
export const toggleFlagFeedback = async (eventId: string, feedbackId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  const events = getStoredEvents();
  const eventIndex = events.findIndex((e) => e.id === eventId);

  if (eventIndex === -1) return false;

  const event = events[eventIndex];
  const feedbackIndex = event.feedback.findIndex((f) => f.id === feedbackId);

  if (feedbackIndex === -1) return false;

  events[eventIndex].feedback[feedbackIndex].isFlagged = !events[eventIndex].feedback[feedbackIndex].isFlagged;
  saveEvents(events);

  return true;
};

// Get event analytics
export const getEventAnalytics = async (eventId: string): Promise<{
  totalRSVPs: number;
  totalCheckIns: number;
  checkInPercentage: number;
  feedbackCount: number;
  emojiCounts: Record<string, number>;
  feedbackTimeline: Array<{timestamp: string;count: number;}>;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay

  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const totalRSVPs = event.attendees.length;
  const totalCheckIns = event.attendees.filter((a) => a.attended).length;
  const checkInPercentage = totalRSVPs > 0 ? totalCheckIns / totalRSVPs * 100 : 0;
  const feedbackCount = event.feedback.length;

  // Count emoji reactions
  const emojiCounts: Record<string, number> = {
    "👍": 0,
    "👎": 0,
    "❤️": 0,
    "😮": 0
  };

  event.feedback.forEach((f) => {
    if (f.emoji) {
      emojiCounts[f.emoji]++;
    }
  });

  // Group feedback by hour for timeline
  const feedbackByHour = new Map<string, number>();

  event.feedback.forEach((f) => {
    const date = new Date(f.timestamp);
    const hourKey = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours()
    ).toISOString();

    feedbackByHour.set(hourKey, (feedbackByHour.get(hourKey) || 0) + 1);
  });

  const feedbackTimeline = Array.from(feedbackByHour.entries()).
  map(([timestamp, count]) => ({ timestamp, count })).
  sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    totalRSVPs,
    totalCheckIns,
    checkInPercentage,
    feedbackCount,
    emojiCounts,
    feedbackTimeline
  };
};