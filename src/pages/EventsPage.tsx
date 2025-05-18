import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { EventCard } from "../components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { Event, getUserEvents, getAttendingEvents, getAllEvents } from "../services/eventService";

const EventsPage: React.FC = () => {
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState("attending");
  const [loading, setLoading] = useState(true);
  const { user, isHost } = useAuth();
  const { toast } = useToast();

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        if (user) {
          // First, ensure we have some events in the system
          await getAllEvents();

          // Get events the user is attending
          const attendingData = await getAttendingEvents(user.id);
          setAttendingEvents(attendingData);

          // If user is a host, get their hosted events
          if (isHost) {
            const hostedData = await getUserEvents(user.id);
            setHostedEvents(hostedData);

            // Default to "hosted" tab if user is a host and has events
            if (hostedData.length > 0) {
              setActiveTab("hosted");
            }
          }
        }
      } catch (error) {
        toast({
          title: "Error loading events",
          description: "There was a problem loading your events.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, isHost, toast]);

  // Sort events by start time (upcoming first)
  const sortedHostedEvents = [...hostedEvents].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const sortedAttendingEvents = [...attendingEvents].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Layout>
      <div className="space-y-6" data-id="as4s3473u" data-path="src/pages/EventsPage.tsx">
        <div className="flex items-center justify-between" data-id="fsvkcko2q" data-path="src/pages/EventsPage.tsx">
          <div data-id="txnfewppl" data-path="src/pages/EventsPage.tsx">
            <h1 className="text-3xl font-bold tracking-tight" data-id="1iiuu2bjr" data-path="src/pages/EventsPage.tsx">My Events</h1>
            <p className="text-gray-500" data-id="1ce5b0ccn" data-path="src/pages/EventsPage.tsx">View and manage your events</p>
          </div>
          {isHost &&
          <Link to="/events/create">
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Create Event
              </Button>
            </Link>
          }
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-80 grid-cols-2">
            <TabsTrigger value="attending">Attending</TabsTrigger>
            {isHost && <TabsTrigger value="hosted">Hosting</TabsTrigger>}
          </TabsList>

          <TabsContent value="attending" className="pt-4">
            {loading ?
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="9x37tlj9u" data-path="src/pages/EventsPage.tsx">
                {[1, 2, 3].map((i) =>
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" data-id="03iae1hyy" data-path="src/pages/EventsPage.tsx"></div>
              )}
              </div> :
            sortedAttendingEvents.length > 0 ?
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="eonmzl84b" data-path="src/pages/EventsPage.tsx">
                {sortedAttendingEvents.map((event) =>
              <EventCard key={event.id} event={event} isAttending={true} />
              )}
              </div> :

            <div className="text-center py-12" data-id="l5mgopjj9" data-path="src/pages/EventsPage.tsx">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900" data-id="ezh5hfegh" data-path="src/pages/EventsPage.tsx">No events yet</h3>
                <p className="mt-2 text-sm text-gray-500" data-id="0uo080j2p" data-path="src/pages/EventsPage.tsx">
                  You haven't RSVP'd to any events yet.
                </p>
                <div className="mt-6" data-id="1gbik2um8" data-path="src/pages/EventsPage.tsx">
                  <Link to="/">
                    <Button>Browse Events</Button>
                  </Link>
                </div>
              </div>
            }
          </TabsContent>

          {isHost &&
          <TabsContent value="hosted" className="pt-4">
              {loading ?
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="oefrrim4i" data-path="src/pages/EventsPage.tsx">
                  {[1, 2, 3].map((i) =>
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" data-id="f48cvnh59" data-path="src/pages/EventsPage.tsx"></div>
              )}
                </div> :
            sortedHostedEvents.length > 0 ?
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="980e0k5c9" data-path="src/pages/EventsPage.tsx">
                  {sortedHostedEvents.map((event) =>
              <EventCard key={event.id} event={event} />
              )}
                </div> :

            <div className="text-center py-12" data-id="ppp1mz4ea" data-path="src/pages/EventsPage.tsx">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900" data-id="c7mwye9xy" data-path="src/pages/EventsPage.tsx">No hosted events</h3>
                  <p className="mt-2 text-sm text-gray-500" data-id="6wfep45hp" data-path="src/pages/EventsPage.tsx">
                    Get started by creating your first event.
                  </p>
                  <div className="mt-6" data-id="86bupasqp" data-path="src/pages/EventsPage.tsx">
                    <Link to="/events/create">
                      <Button>Create Event</Button>
                    </Link>
                  </div>
                </div>
            }
            </TabsContent>
          }
        </Tabs>
      </div>
    </Layout>);

};

export default EventsPage;