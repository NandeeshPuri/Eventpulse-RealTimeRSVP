// Format date in a user-friendly way
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format time in a user-friendly way
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format date and time together
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Check if an event is live
export const isEventLive = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  return now >= start && now <= end;
};

// Check if check-in is available (1 hour before event starts until event ends)
export const isCheckInAvailable = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Set check-in availability to 1 hour before event start
  const checkInStart = new Date(start.getTime() - 60 * 60 * 1000);

  return now >= checkInStart && now <= end;
};

// Check if an event has ended
export const hasEventEnded = (endTime: string): boolean => {
  const now = new Date();
  const end = new Date(endTime);

  return now > end;
};

// Check if RSVP deadline has passed
export const hasRSVPDeadlinePassed = (rsvpDeadline: string): boolean => {
  const now = new Date();
  const deadline = new Date(rsvpDeadline);

  return now > deadline;
};

// Get time remaining until event start
export const getTimeUntilStart = (startTime: string): string => {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();

  if (diff <= 0) {
    return "Event has started";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h until start`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m until start`;
  } else {
    return `${minutes}m until start`;
  }
};

// Get duration of event in hours and minutes
export const getEventDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};