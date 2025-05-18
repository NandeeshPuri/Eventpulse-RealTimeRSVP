import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { LiveStatusBadge } from "../components/LiveStatusBadge";
import { sendPostEventNotifications } from "../utils/eventNotifications";
import {
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  AlertTriangle,
  CheckCircle } from
"lucide-react";
import {
  formatDate,
  formatTime,
  getTimeUntilStart,
  isEventLive,
  hasEventEnded,
  isCheckInAvailable,
  hasRSVPDeadlinePassed } from
"../utils/dateUtils";
import {
  Event,
  getEventById,
  rsvpToEvent,
  checkInToEvent,
  deleteEvent } from
"../services/eventService";
import { FeedbackStream } from "../components/FeedbackStream";
import { AttendeeList } from "../components/AttendeeList";
import { EventAnalytics } from "../components/EventAnalytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from
"@/components/ui/alert-dialog";

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{eventId: string;}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Check if user is the creator of the event
  const isCreator = user?.id === event?.createdBy;

  // Check if user has RSVP'd
  const userRSVP = event?.attendees.find((a) => a.userId === user?.id);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        if (!eventId) return;
        const data = await getEventById(eventId);
        if (data) {
          setEvent(data);

          // Set the appropriate tab based on event status
          if (data.status === "closed") {
            setActiveTab("analytics");

            // Check if it's a recently closed event and send post-event notifications
            const closedRecently = new Date().getTime() - new Date(data.endTime).getTime() < 24 * 60 * 60 * 1000; // 24 hours
            if (closedRecently && data.attendees.some((a) => a.attended)) {
              // Send post-event thank you emails (in a real app, this would be triggered by a scheduler)
              sendPostEventNotifications(data).catch((err) => console.error("Failed to send post-event notifications:", err));
            }
          } else if (data.status === "live") {
            setActiveTab("feedback");
          }
        } else {
          toast({
            title: "Event not found",
            description: "The event you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
          navigate("/events");
        }
      } catch (error) {
        toast({
          title: "Error loading event",
          description: "There was a problem loading the event details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Refresh event data every 30 seconds for real-time updates
    const interval = setInterval(fetchEvent, 30000);

    return () => clearInterval(interval);
  }, [eventId, navigate, toast]);

  // Handle RSVP
  const handleRSVP = async () => {
    if (!event || !user) return;

    setIsRSVPing(true);
    try {
      const success = await rsvpToEvent(event.id, {
        userId: user.id,
        name: user.name,
        email: user.email
      });

      if (success) {
        toast({
          title: "RSVP Confirmed",
          description: `You're confirmed for ${event.title}!`
        });

        // Refresh event data
        const updatedEvent = await getEventById(event.id);
        if (updatedEvent) {
          setEvent(updatedEvent);
        }
      }
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: error instanceof Error ?
        error.message :
        "There was a problem with your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRSVPing(false);
    }
  };

  // Handle Check-In
  const handleCheckIn = async () => {
    if (!event || !user) return;

    setIsCheckingIn(true);
    try {
      const success = await checkInToEvent(event.id, user.id);

      if (success) {
        toast({
          title: "Check-In Successful",
          description: `You've checked in to ${event.title}!`
        });

        // Refresh event data
        const updatedEvent = await getEventById(event.id);
        if (updatedEvent) {
          setEvent(updatedEvent);
        }
      }
    } catch (error) {
      toast({
        title: "Check-In Failed",
        description: error instanceof Error ?
        error.message :
        "There was a problem with your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async () => {
    if (!event) return;

    setIsDeleting(true);
    try {
      const success = await deleteEvent(event.id);

      if (success) {
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted."
        });
        navigate("/events");
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate status badge
  const getStatusBadge = () => {
    if (!event) return null;

    if (isEventLive(event.startTime, event.endTime)) {
      return <LiveStatusBadge status="live" />;
    } else if (hasEventEnded(event.endTime)) {
      return <LiveStatusBadge status="closed" />;
    } else {
      return <LiveStatusBadge status="upcoming" />;
    }
  };

  // Generate RSVP/Check-In button
  const getActionButton = () => {
    if (!event || !isAuthenticated || !user) {
      return (
        <Button onClick={() => navigate("/login")} className="w-full md:w-auto">
          Log in to RSVP
        </Button>);

    }

    // If user is the creator
    if (isCreator) {
      return null;
    }

    // If event has ended
    if (hasEventEnded(event.endTime)) {
      return null;
    }

    // If user has already RSVP'd
    if (userRSVP) {
      // If check-in is available and user hasn't checked in yet
      if (isCheckInAvailable(event.startTime, event.endTime) && !userRSVP.attended) {
        return (
          <Button
            onClick={handleCheckIn}
            disabled={isCheckingIn}
            className="w-full md:w-auto">

            {isCheckingIn ? "Checking In..." : "Check In Now"}
          </Button>);

      }

      // If user has already checked in
      if (userRSVP.attended) {
        return (
          <Button variant="outline" disabled className="w-full md:w-auto">
            <CheckCircle className="mr-2 h-4 w-4" />
            Checked In
          </Button>);

      }

      // User has RSVP'd but check-in not available yet
      return (
        <Button variant="outline" disabled className="w-full md:w-auto">
          <CheckCircle className="mr-2 h-4 w-4" />
          RSVP Confirmed
        </Button>);

    }

    // If RSVP deadline has passed
    if (hasRSVPDeadlinePassed(event.rsvpDeadline)) {
      return (
        <Button variant="outline" disabled className="w-full md:w-auto">
          <AlertTriangle className="mr-2 h-4 w-4" />
          RSVP Deadline Passed
        </Button>);

    }

    // If event is at capacity
    if (event.attendees.length >= event.maxAttendees) {
      return (
        <Button variant="outline" disabled className="w-full md:w-auto">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Event Full
        </Button>);

    }

    // Default: Allow RSVP
    return (
      <Button
        onClick={handleRSVP}
        disabled={isRSVPing}
        className="w-full md:w-auto">

        {isRSVPing ? "Processing..." : "RSVP to Event"}
      </Button>);

  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col gap-4" data-id="h5tgs1svt" data-path="src/pages/EventDetailsPage.tsx">
          <div className="h-8 bg-gray-200 w-3/4 animate-pulse rounded" data-id="mpb8m9ces" data-path="src/pages/EventDetailsPage.tsx"></div>
          <div className="h-4 bg-gray-200 w-1/2 animate-pulse rounded" data-id="iwhq61gts" data-path="src/pages/EventDetailsPage.tsx"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg mt-6" data-id="ac1quq7sk" data-path="src/pages/EventDetailsPage.tsx"></div>
        </div>
      </Layout>);

  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12" data-id="hh2pqw59n" data-path="src/pages/EventDetailsPage.tsx">
          <h2 className="text-2xl font-bold" data-id="zq4y54je5" data-path="src/pages/EventDetailsPage.tsx">Event Not Found</h2>
          <p className="mt-2 text-gray-600" data-id="gsu1htxlk" data-path="src/pages/EventDetailsPage.tsx">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/events")} className="mt-4">
            Back to Events
          </Button>
        </div>
      </Layout>);

  }

  return (
    <Layout>
      <div className="space-y-6" data-id="w1u7vsjkk" data-path="src/pages/EventDetailsPage.tsx">
        {/* Event Header */}
        <div className="space-y-2" data-id="l64ata0m3" data-path="src/pages/EventDetailsPage.tsx">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4" data-id="zhztdzigi" data-path="src/pages/EventDetailsPage.tsx">
            <div className="space-y-1" data-id="jdoy0jgpk" data-path="src/pages/EventDetailsPage.tsx">
              <div className="flex items-center gap-2" data-id="21hk45gst" data-path="src/pages/EventDetailsPage.tsx">
                {getStatusBadge()}
                <span className="text-sm text-gray-500" data-id="q7hl66j2x" data-path="src/pages/EventDetailsPage.tsx">
                  {event.attendees.length}/{event.maxAttendees} attendees
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight" data-id="y8tahsuh6" data-path="src/pages/EventDetailsPage.tsx">{event.title}</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2" data-id="efcusnkjb" data-path="src/pages/EventDetailsPage.tsx">
              {getActionButton()}
              
              {isCreator && !hasEventEnded(event.endTime) &&
              <div className="flex gap-2" data-id="h2nb8dd7q" data-path="src/pages/EventDetailsPage.tsx">
                  <Button
                  variant="outline"
                  onClick={() => navigate(`/events/${event.id}/edit`)}>

                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          event and remove all attendee RSVPs and feedback.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={handleDeleteEvent}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700">

                          {isDeleting ? "Deleting..." : "Delete Event"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              }
            </div>
          </div>
          
          {/* Event Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" data-id="uyuskh20m" data-path="src/pages/EventDetailsPage.tsx">
            <div className="flex items-start" data-id="9byigl8je" data-path="src/pages/EventDetailsPage.tsx">
              <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
              <div data-id="bf07xvv7k" data-path="src/pages/EventDetailsPage.tsx">
                <p data-id="r59kv176e" data-path="src/pages/EventDetailsPage.tsx">{formatDate(event.startTime)}</p>
                <p className="text-gray-600" data-id="fp9rh0i48" data-path="src/pages/EventDetailsPage.tsx">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.timezone})
                </p>
              </div>
            </div>
            
            <div className="flex items-start" data-id="xjabdix2e" data-path="src/pages/EventDetailsPage.tsx">
              <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
              <div data-id="xvdzwj176" data-path="src/pages/EventDetailsPage.tsx">
                <p data-id="o607njr0c" data-path="src/pages/EventDetailsPage.tsx">{event.isVirtual ? "Virtual Event" : event.location}</p>
                {event.isVirtual &&
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center text-sm" data-id="2m8vtjm36" data-path="src/pages/EventDetailsPage.tsx">

                    Join Meeting <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                }
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!isEventLive(event.startTime, event.endTime) && !hasEventEnded(event.endTime)}>
              Feedback
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled={!hasEventEnded(event.endTime)}>
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="pt-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-id="ec1ea446c" data-path="src/pages/EventDetailsPage.tsx">
              <div className="md:col-span-2 space-y-6" data-id="owgi4tcf4" data-path="src/pages/EventDetailsPage.tsx">
                <div className="prose max-w-none" data-id="v0mdejeo1" data-path="src/pages/EventDetailsPage.tsx">
                  <h3 className="text-xl font-semibold mb-4" data-id="364ab25l1" data-path="src/pages/EventDetailsPage.tsx">About this event</h3>
                  <p className="whitespace-pre-line" data-id="79ir9n2tw" data-path="src/pages/EventDetailsPage.tsx">{event.description}</p>
                </div>
              </div>
              
              <div className="space-y-6" data-id="4nfwyhr66" data-path="src/pages/EventDetailsPage.tsx">
                <div className="bg-gray-50 p-4 rounded-lg" data-id="fxooumtji" data-path="src/pages/EventDetailsPage.tsx">
                  <h3 className="text-lg font-medium mb-4" data-id="tz5biwn6z" data-path="src/pages/EventDetailsPage.tsx">Event Information</h3>
                  <ul className="space-y-4" data-id="tdz8d9kxb" data-path="src/pages/EventDetailsPage.tsx">
                    <li className="flex items-start" data-id="8iexjfsma" data-path="src/pages/EventDetailsPage.tsx">
                      <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div data-id="s6u6n9oca" data-path="src/pages/EventDetailsPage.tsx">
                        <p className="font-medium" data-id="0o6yjv23w" data-path="src/pages/EventDetailsPage.tsx">Time until event</p>
                        <p className="text-gray-600" data-id="syyoj4jzt" data-path="src/pages/EventDetailsPage.tsx">
                          {isEventLive(event.startTime, event.endTime) ?
                          "Happening now" :
                          hasEventEnded(event.endTime) ?
                          "Event has ended" :
                          getTimeUntilStart(event.startTime)}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start" data-id="rl8rgp1uw" data-path="src/pages/EventDetailsPage.tsx">
                      <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div data-id="nrsrh19fp" data-path="src/pages/EventDetailsPage.tsx">
                        <p className="font-medium" data-id="0lwnayb3e" data-path="src/pages/EventDetailsPage.tsx">Attendees</p>
                        <p className="text-gray-600" data-id="5r3lttxpt" data-path="src/pages/EventDetailsPage.tsx">
                          {event.attendees.length} confirmed of {event.maxAttendees} spots
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start" data-id="cfwn0brjo" data-path="src/pages/EventDetailsPage.tsx">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div data-id="n4v06kotf" data-path="src/pages/EventDetailsPage.tsx">
                        <p className="font-medium" data-id="q13ygdejl" data-path="src/pages/EventDetailsPage.tsx">RSVP deadline</p>
                        <p className="text-gray-600" data-id="m9mknwip3" data-path="src/pages/EventDetailsPage.tsx">
                          {formatDate(event.rsvpDeadline)} at {formatTime(event.rsvpDeadline)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees" className="pt-4 pb-8">
            <AttendeeList event={event} isCreator={isCreator} />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="pt-4 pb-8">
            <FeedbackStream event={event} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="pt-4 pb-8">
            <EventAnalytics eventId={event.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>);

};

export default EventDetailsPage;