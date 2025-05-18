import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { EventForm } from "../components/EventForm";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { Event, getEventById, updateEvent } from "../services/eventService";

const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{eventId: string;}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isHost } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        if (!eventId) return;

        const data = await getEventById(eventId);

        if (data) {
          setEvent(data);

          // Redirect if not the creator of the event
          if (user?.id !== data.createdBy) {
            toast({
              title: "Access Denied",
              description: "You can only edit events you've created.",
              variant: "destructive"
            });
            navigate(`/events/${eventId}`);
          }

          // Redirect if event has ended
          if (data.status === "closed") {
            toast({
              title: "Cannot Edit",
              description: "You cannot edit events that have already ended.",
              variant: "destructive"
            });
            navigate(`/events/${eventId}`);
          }
        } else {
          toast({
            title: "Event not found",
            description: "The event you're trying to edit doesn't exist.",
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

    // Redirect if not a host
    if (!isHost) {
      toast({
        title: "Access Denied",
        description: "Only hosts can edit events.",
        variant: "destructive"
      });
      navigate("/events");
      return;
    }

    fetchEvent();
  }, [eventId, navigate, toast, user, isHost]);

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    if (!eventId) return;

    try {
      const updatedEvent = await updateEvent(eventId, eventData);

      if (!updatedEvent) {
        throw new Error("Failed to update event");
      }

      return updatedEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Failed to update event",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6" data-id="c7y2yyyki" data-path="src/pages/EditEventPage.tsx">
          <div className="h-8 bg-gray-200 w-3/4 animate-pulse rounded" data-id="7io91sbft" data-path="src/pages/EditEventPage.tsx"></div>
          <div className="h-4 bg-gray-200 w-1/2 animate-pulse rounded" data-id="qenkkg872" data-path="src/pages/EditEventPage.tsx"></div>
          <Separator />
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg" data-id="2yres009b" data-path="src/pages/EditEventPage.tsx"></div>
        </div>
      </Layout>);

  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12" data-id="en23yzhrn" data-path="src/pages/EditEventPage.tsx">
          <h2 className="text-2xl font-bold" data-id="2cb1iowwf" data-path="src/pages/EditEventPage.tsx">Event Not Found</h2>
          <p className="mt-2 text-gray-600" data-id="6sf4qe5h7" data-path="src/pages/EditEventPage.tsx">
            The event you're trying to edit doesn't exist or has been removed.
          </p>
        </div>
      </Layout>);

  }

  return (
    <Layout>
      <div className="space-y-6" data-id="hdsytsyps" data-path="src/pages/EditEventPage.tsx">
        <div data-id="qi8mms0et" data-path="src/pages/EditEventPage.tsx">
          <h1 className="text-3xl font-bold tracking-tight" data-id="bcgudxz45" data-path="src/pages/EditEventPage.tsx">Edit Event</h1>
          <p className="text-gray-500" data-id="85q2igkus" data-path="src/pages/EditEventPage.tsx">
            Make changes to your event details below.
          </p>
        </div>

        <Separator />

        <EventForm initialData={event} onSubmit={handleUpdateEvent} isEditing={true} />
      </div>
    </Layout>);

};

export default EditEventPage;