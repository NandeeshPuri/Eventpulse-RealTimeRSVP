import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";
import { Event } from "../services/eventService";
import { formatDate, formatTime, getTimeUntilStart, isEventLive, hasEventEnded } from "../utils/dateUtils";

interface EventCardProps {
  event: Event;
  isAttending?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isAttending }) => {
  const getStatusBadge = () => {
    if (isEventLive(event.startTime, event.endTime)) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
          <span className="mr-1" data-id="0hve67nwe" data-path="src/components/EventCard.tsx">●</span> Live Now
        </Badge>);

    } else if (hasEventEnded(event.endTime)) {
      return <Badge variant="outline">Closed</Badge>;
    } else {
      return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start" data-id="y3ejs2yoz" data-path="src/components/EventCard.tsx">
          {getStatusBadge()}
          <span className="text-sm text-gray-500" data-id="6br83986y" data-path="src/components/EventCard.tsx">
            {event.attendees.length}/{event.maxAttendees} attendees
          </span>
        </div>
        <CardTitle className="mt-2 line-clamp-2">
          <Link to={`/events/${event.id}`} className="hover:text-purple-600 transition-colors">
            {event.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col space-y-2 text-sm" data-id="slxxihdoi" data-path="src/components/EventCard.tsx">
          <div className="flex items-start" data-id="60x8n5vc2" data-path="src/components/EventCard.tsx">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
            <div data-id="k20e9r25w" data-path="src/components/EventCard.tsx">
              <p data-id="z1fpclryr" data-path="src/components/EventCard.tsx">{formatDate(event.startTime)}</p>
              <p className="text-gray-500" data-id="1ozzntlf5" data-path="src/components/EventCard.tsx">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
            </div>
          </div>
          <div className="flex items-start" data-id="1fh4n5764" data-path="src/components/EventCard.tsx">
            <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
            <span className="line-clamp-1" data-id="h3ijtdgl9" data-path="src/components/EventCard.tsx">
              {event.isVirtual ? "Virtual Event" : event.location}
            </span>
          </div>
          {!hasEventEnded(event.endTime) &&
          <div className="flex items-center" data-id="zeazledvu" data-path="src/components/EventCard.tsx">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium" data-id="e9xv0t87f" data-path="src/components/EventCard.tsx">
                {isEventLive(event.startTime, event.endTime) ?
              "Happening now" :
              getTimeUntilStart(event.startTime)}
              </span>
            </div>
          }
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link to={`/events/${event.id}`}>
            {isAttending ?
            isEventLive(event.startTime, event.endTime) ?
            "Join Event" :
            hasEventEnded(event.endTime) ?
            "View Summary" :
            "View Details" :
            "View Event"}
          </Link>
        </Button>
      </CardFooter>
    </Card>);

};