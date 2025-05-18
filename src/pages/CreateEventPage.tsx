import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { EventForm } from "../components/EventForm";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { Event, createEvent } from "../services/eventService";

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isHost } = useAuth();

  // Redirect if not a host
  React.useEffect(() => {
    if (!isHost) {
      toast({
        title: "Access Denied",
        description: "Only hosts can create events.",
        variant: "destructive"
      });
      navigate("/events");
    }
  }, [isHost, navigate, toast]);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create an event.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add creator information
      const fullEventData = {
        ...eventData,
        createdBy: user.id
      };

      await createEvent(fullEventData as Omit<Event, "id" | "attendees" | "feedback" | "status">);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Failed to create event",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <Layout>
      <div className="space-y-6" data-id="adree0rm0" data-path="src/pages/CreateEventPage.tsx">
        <div data-id="qs9c8utvo" data-path="src/pages/CreateEventPage.tsx">
          <h1 className="text-3xl font-bold tracking-tight" data-id="hfsfyu6w0" data-path="src/pages/CreateEventPage.tsx">Create Event</h1>
          <p className="text-gray-500" data-id="hm3wfywva" data-path="src/pages/CreateEventPage.tsx">
            Fill out the form below to create a new event.
          </p>
        </div>

        <Separator />

        <EventForm onSubmit={handleCreateEvent} />
      </div>
    </Layout>);

};

export default CreateEventPage;