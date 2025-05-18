import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { EventCard } from "../components/EventCard";
import { CalendarView } from "../components/CalendarView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Search, ArrowUpDown, List, CalendarIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Event, getAllEvents } from "../services/eventService";
import { isEventLive, hasEventEnded } from "../utils/dateUtils";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"list" | "calendar">("list");
  const [sortOption, setSortOption] = useState<"date" | "title" | "attendees">("date");
  const [filterOption, setFilterOption] = useState<"all" | "upcoming" | "live" | "past">("all");

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getAllEvents();
        // Ensure we have data even if localStorage was empty
        if (data.length === 0) {
          toast({
            title: "Loading sample events",
            description: "Initializing with sample event data."
          });
          // Try fetching again after a brief delay
          setTimeout(async () => {
            const refreshedData = await getAllEvents();
            setEvents(refreshedData);
            setLoading(false);
          }, 1000);
          return;
        }
        setEvents(data);
      } catch (error) {
        toast({
          title: "Error loading events",
          description: "There was a problem loading the events.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Poll for updates every minute to keep live status current
    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);
  }, [toast]);

  // Filter events based on search and filter options
  const filteredEvents = events.filter((event) => {
    // Search filter
    const matchesSearch =
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesFilter =
    filterOption === "all" ||
    filterOption === "live" && isEventLive(event.startTime, event.endTime) ||
    filterOption === "upcoming" && !isEventLive(event.startTime, event.endTime) && !hasEventEnded(event.endTime) ||
    filterOption === "past" && hasEventEnded(event.endTime);

    return matchesSearch && matchesFilter;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    } else if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "attendees") {
      return b.attendees.length - a.attendees.length;
    }
    return 0;
  });

  // Count live events
  const liveEventsCount = events.filter((event) =>
  isEventLive(event.startTime, event.endTime)
  ).length;

  return (
    <Layout>
      <div className="space-y-6" data-id="q1zuzk95l" data-path="src/pages/HomePage.tsx">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg py-12 px-6 text-white text-center" data-id="e9qb5c2ad" data-path="src/pages/HomePage.tsx">
          <h1 className="text-4xl font-bold mb-4" data-id="gs37cixjp" data-path="src/pages/HomePage.tsx">
            Welcome to EventPulse
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" data-id="ooskq1esm" data-path="src/pages/HomePage.tsx">
            The platform for real-time event management, RSVP tracking, and live audience engagement.
          </p>
          {liveEventsCount > 0 &&
          <div className="mb-6" data-id="mntxmalty" data-path="src/pages/HomePage.tsx">
              <span className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2" data-id="vu9hplpc7" data-path="src/pages/HomePage.tsx">
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" data-id="fasexw6kq" data-path="src/pages/HomePage.tsx"></span>
                {liveEventsCount} event{liveEventsCount > 1 ? 's' : ''} happening now
              </span>
            </div>
          }
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-id="lwemup381" data-path="src/pages/HomePage.tsx">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to="/events">My Events</Link>
            </Button>
            {user?.role === "host" &&
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-20">
                <Link to="/events/create">Create Event</Link>
              </Button>
            }
          </div>
        </section>

        {/* Events Section */}
        <section data-id="hs5dty1yp" data-path="src/pages/HomePage.tsx">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" data-id="cnc4bpzgh" data-path="src/pages/HomePage.tsx">
            <h2 className="text-3xl font-bold" data-id="sb7s7c6qe" data-path="src/pages/HomePage.tsx">Events</h2>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" data-id="pzc5n2ztf" data-path="src/pages/HomePage.tsx">
              <div className="relative flex-1 sm:flex-initial" data-id="skjmssm2x" data-path="src/pages/HomePage.tsx">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />

              </div>
              
              <Select
                value={filterOption}
                onValueChange={(value) => setFilterOption(value as any)}>

                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="live">Live Now</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as any)}>

                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="attendees">Popularity</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md overflow-hidden" data-id="5yrulzdx3" data-path="src/pages/HomePage.tsx">
                <Button
                  variant={viewType === "list" ? "default" : "outline"}
                  className="rounded-none border-0 px-3"
                  onClick={() => setViewType("list")}>

                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === "calendar" ? "default" : "outline"}
                  className="rounded-none border-0 px-3"
                  onClick={() => setViewType("calendar")}>

                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ?
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="zlicfvqgg" data-path="src/pages/HomePage.tsx">
              {[1, 2, 3, 4, 5, 6].map((i) =>
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" data-id="psvh1c015" data-path="src/pages/HomePage.tsx"></div>
            )}
            </div> :

          <>
              {viewType === "list" ?
            sortedEvents.length > 0 ?
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-id="blu86qym6" data-path="src/pages/HomePage.tsx">
                    {sortedEvents.map((event) =>
              <EventCard key={event.id} event={event} />
              )}
                  </div> :

            <div className="text-center py-12 bg-gray-50 rounded-lg" data-id="18oypql8m" data-path="src/pages/HomePage.tsx">
                    <CalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900" data-id="1ztj1psgg" data-path="src/pages/HomePage.tsx">No events found</h3>
                    <p className="mt-2 text-sm text-gray-500" data-id="s2ptbr93a" data-path="src/pages/HomePage.tsx">
                      {searchTerm ?
                "Try adjusting your search or filter to find more events." :
                "There are no events matching your current filters."}
                    </p>
                  </div> :


            <CalendarView events={sortedEvents} />
            }
            </>
          }
        </section>

        {/* Features Section */}
        <section className="py-12" data-id="dxp3oyehg" data-path="src/pages/HomePage.tsx">
          <h2 className="text-3xl font-bold text-center mb-12" data-id="vb4x29n27" data-path="src/pages/HomePage.tsx">Everything You Need for Successful Events</h2>
          
          <div className="grid gap-8 md:grid-cols-3" data-id="avy5wston" data-path="src/pages/HomePage.tsx">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center" data-id="4qgjaysia" data-path="src/pages/HomePage.tsx">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-lg mb-4" data-id="2r23p1z7c" data-path="src/pages/HomePage.tsx">
                <CalendarCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-id="1dh8dd5he" data-path="src/pages/HomePage.tsx">Easy RSVP Management</h3>
              <p className="text-gray-600" data-id="5tyvk2azp" data-path="src/pages/HomePage.tsx">
                Collect RSVPs, track attendance, and manage check-ins all in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center" data-id="z3cr90t8s" data-path="src/pages/HomePage.tsx">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4" data-id="v9a0nuvc0" data-path="src/pages/HomePage.tsx">
                <ArrowUpDown className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-id="x56svls3o" data-path="src/pages/HomePage.tsx">Live Feedback</h3>
              <p className="text-gray-600" data-id="snu3nuy2s" data-path="src/pages/HomePage.tsx">
                Collect real-time feedback, emoji reactions, and measure audience sentiment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center" data-id="wg9gu6jd7" data-path="src/pages/HomePage.tsx">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-lg mb-4" data-id="4hlrgmf37" data-path="src/pages/HomePage.tsx">
                <svg
                  className="h-6 w-6 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round" data-id="if5zv6ise" data-path="src/pages/HomePage.tsx">

                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-id="fften3axf" data-path="src/pages/HomePage.tsx" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-id="p9dwy56vb" data-path="src/pages/HomePage.tsx">Comprehensive Analytics</h3>
              <p className="text-gray-600" data-id="hgxd8w8mo" data-path="src/pages/HomePage.tsx">
                Get detailed post-event reports on attendance, engagement, and feedback.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>);

};

export default HomePage;