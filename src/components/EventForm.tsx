import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Event } from "../services/eventService";

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  isEditing?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  onSubmit,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [startDate, setStartDate] = useState(
    initialData.startTime ?
    new Date(initialData.startTime).toISOString().split("T")[0] :
    ""
  );
  const [startTime, setStartTime] = useState(
    initialData.startTime ?
    new Date(initialData.startTime).toISOString().split("T")[1].substring(0, 5) :
    ""
  );
  const [endDate, setEndDate] = useState(
    initialData.endTime ?
    new Date(initialData.endTime).toISOString().split("T")[0] :
    ""
  );
  const [endTime, setEndTime] = useState(
    initialData.endTime ?
    new Date(initialData.endTime).toISOString().split("T")[1].substring(0, 5) :
    ""
  );
  const [timezone, setTimezone] = useState(initialData.timezone || "America/New_York");
  const [location, setLocation] = useState(initialData.location || "");
  const [isVirtual, setIsVirtual] = useState(initialData.isVirtual || false);
  const [rsvpDeadlineDate, setRsvpDeadlineDate] = useState(
    initialData.rsvpDeadline ?
    new Date(initialData.rsvpDeadline).toISOString().split("T")[0] :
    ""
  );
  const [rsvpDeadlineTime, setRsvpDeadlineTime] = useState(
    initialData.rsvpDeadline ?
    new Date(initialData.rsvpDeadline).toISOString().split("T")[1].substring(0, 5) :
    ""
  );
  const [maxAttendees, setMaxAttendees] = useState(initialData.maxAttendees?.toString() || "100");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!description.trim()) {
        throw new Error("Description is required");
      }

      if (!startDate || !startTime || !endDate || !endTime) {
        throw new Error("Event start and end times are required");
      }

      if (!rsvpDeadlineDate || !rsvpDeadlineTime) {
        throw new Error("RSVP deadline is required");
      }

      if (!location.trim()) {
        throw new Error(isVirtual ? "Virtual meeting link is required" : "Location is required");
      }

      if (isNaN(parseInt(maxAttendees)) || parseInt(maxAttendees) <= 0) {
        throw new Error("Maximum attendees must be a positive number");
      }

      // Format dates
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      const rsvpDeadlineDateTime = new Date(`${rsvpDeadlineDate}T${rsvpDeadlineTime}`);

      // Validate date and time logic
      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time");
      }

      if (rsvpDeadlineDateTime >= startDateTime) {
        throw new Error("RSVP deadline must be before the event starts");
      }

      const eventData: Partial<Event> = {
        title,
        description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timezone,
        location,
        isVirtual,
        rsvpDeadline: rsvpDeadlineDateTime.toISOString(),
        maxAttendees: parseInt(maxAttendees)
      };

      await onSubmit(eventData);

      toast({
        title: isEditing ? "Event Updated" : "Event Created",
        description: isEditing ?
        "Your event has been updated successfully." :
        "Your event has been created successfully."
      });

      // Redirect to events page after successful submission
      navigate("/events");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleFormSubmit} className="space-y-6" data-id="mln3rsqww" data-path="src/components/EventForm.tsx">
          <div className="space-y-4" data-id="2j546yd7m" data-path="src/components/EventForm.tsx">
            <div data-id="vccmmknfr" data-path="src/components/EventForm.tsx">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Tech Conference 2023"
                disabled={isSubmitting}
                required />

            </div>

            <div data-id="e9vjh9o1w" data-path="src/components/EventForm.tsx">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                rows={5}
                disabled={isSubmitting}
                required />

            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="ixztzpx70" data-path="src/components/EventForm.tsx">
              <div className="space-y-4" data-id="ceffbj1r9" data-path="src/components/EventForm.tsx">
                <h3 className="font-medium" data-id="sgj9ep7jz" data-path="src/components/EventForm.tsx">Event Start</h3>
                <div className="grid grid-cols-2 gap-2" data-id="s14wqzqdc" data-path="src/components/EventForm.tsx">
                  <div data-id="geo1agqnc" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="startDate">Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                  <div data-id="57xu1982m" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="startTime">Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                </div>
              </div>

              <div className="space-y-4" data-id="miesl7z56" data-path="src/components/EventForm.tsx">
                <h3 className="font-medium" data-id="l0z3i626r" data-path="src/components/EventForm.tsx">Event End</h3>
                <div className="grid grid-cols-2 gap-2" data-id="35j9dvl6i" data-path="src/components/EventForm.tsx">
                  <div data-id="o3l9tav3v" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="endDate">Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                  <div data-id="wcly7pn67" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="endTime">Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                </div>
              </div>
            </div>

            <div data-id="4bloihsfq" data-path="src/components/EventForm.tsx">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={timezone}
                onValueChange={setTimezone}
                disabled={isSubmitting}>

                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                  <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                  <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4" data-id="nnksfrixa" data-path="src/components/EventForm.tsx">
              <div className="flex items-center justify-between" data-id="wuu79hnt0" data-path="src/components/EventForm.tsx">
                <Label htmlFor="isVirtual" className="cursor-pointer">Virtual Event</Label>
                <Switch
                  id="isVirtual"
                  checked={isVirtual}
                  onCheckedChange={setIsVirtual}
                  disabled={isSubmitting} />

              </div>

              <div data-id="ue46tjxfq" data-path="src/components/EventForm.tsx">
                <Label htmlFor="location">
                  {isVirtual ? "Meeting Link" : "Location"}
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                  isVirtual ?
                  "e.g. https://zoom.us/j/123456789" :
                  "e.g. Convention Center, 123 Main St, City"
                  }
                  disabled={isSubmitting}
                  required />

              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="yddk9h74a" data-path="src/components/EventForm.tsx">
              <div className="space-y-4" data-id="odbaamct9" data-path="src/components/EventForm.tsx">
                <h3 className="font-medium" data-id="swjahw36a" data-path="src/components/EventForm.tsx">RSVP Deadline</h3>
                <div className="grid grid-cols-2 gap-2" data-id="bk8bgfpxl" data-path="src/components/EventForm.tsx">
                  <div data-id="d7x2extiq" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="rsvpDate">Date</Label>
                    <Input
                      id="rsvpDate"
                      type="date"
                      value={rsvpDeadlineDate}
                      onChange={(e) => setRsvpDeadlineDate(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                  <div data-id="72qk07sjq" data-path="src/components/EventForm.tsx">
                    <Label htmlFor="rsvpTime">Time</Label>
                    <Input
                      id="rsvpTime"
                      type="time"
                      value={rsvpDeadlineTime}
                      onChange={(e) => setRsvpDeadlineTime(e.target.value)}
                      disabled={isSubmitting}
                      required />

                  </div>
                </div>
              </div>

              <div data-id="bpyznoax0" data-path="src/components/EventForm.tsx">
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  disabled={isSubmitting}
                  required />

              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2" data-id="k5hn1zxcu" data-path="src/components/EventForm.tsx">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/events")}
              disabled={isSubmitting}>

              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ?
              isEditing ?
              "Updating..." :
              "Creating..." :
              isEditing ?
              "Update Event" :
              "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);

};