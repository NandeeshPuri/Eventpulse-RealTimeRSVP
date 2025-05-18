import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Event } from "../services/eventService";
import { isEventLive, hasEventEnded } from "../utils/dateUtils";

interface CalendarViewProps {
  events: Event[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Navigation handlers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Calendar utility functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date for display
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 p-1 border border-gray-200 bg-gray-50" data-id="nvb4tkd2q" data-path="src/components/CalendarView.tsx"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const eventsOnDay = events.filter((event) => {
        const eventDate = new Date(event.startTime);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear());

      });

      days.push(
        <div key={day} className="h-28 border border-gray-200 p-1 overflow-hidden relative" data-id="5sv03fv7z" data-path="src/components/CalendarView.tsx">
          <div className="flex justify-between items-start" data-id="5oyabe1l2" data-path="src/components/CalendarView.tsx">
            <span className="font-medium text-sm p-1" data-id="bo72vlfjc" data-path="src/components/CalendarView.tsx">{day}</span>
            {isToday(date) && <Badge className="bg-blue-500">Today</Badge>}
          </div>
          <div className="overflow-y-auto max-h-20 space-y-1" data-id="caz3jlazx" data-path="src/components/CalendarView.tsx">
            {eventsOnDay.map((event) =>
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className={`text-xs p-1 rounded truncate cursor-pointer ${
              isEventLive(event.startTime, event.endTime) ?
              "bg-red-100 text-red-800 border-l-2 border-red-500" :
              hasEventEnded(event.endTime) ?
              "bg-gray-100 text-gray-800" :
              "bg-blue-100 text-blue-800 border-l-2 border-blue-500"}`
              } data-id="2w2mqlxwm" data-path="src/components/CalendarView.tsx">

                {new Date(event.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}{" "}
                - {event.title}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear());

  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between" data-id="nniyona2e" data-path="src/components/CalendarView.tsx">
          <CardTitle className="text-xl">
            <Calendar className="h-5 w-5 inline mr-2" />
            {formatMonth(currentMonth)}
          </CardTitle>
          <div className="flex items-center space-x-2" data-id="s7045eovv" data-path="src/components/CalendarView.tsx">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
              className="h-8">

              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center" data-id="ftniow8jr" data-path="src/components/CalendarView.tsx">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) =>
          <div key={day} className="py-2 font-medium text-sm border-b" data-id="354w3z1h5" data-path="src/components/CalendarView.tsx">
              {day}
            </div>
          )}
        </div>
        <div className="grid grid-cols-7" data-id="htanf3m34" data-path="src/components/CalendarView.tsx">{generateCalendarDays()}</div>
      </CardContent>
    </Card>);

};