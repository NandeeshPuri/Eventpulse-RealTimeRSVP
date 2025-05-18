import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search, UserPlus } from "lucide-react";
import { Event, addWalkInAttendee } from "../services/eventService";
import { useToast } from "@/hooks/use-toast";
import { formatDateTime } from "../utils/dateUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
"@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AttendeeListProps {
  event: Event;
  isCreator: boolean;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ event, isCreator }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [walkInName, setWalkInName] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter attendees by search term
  const filteredAttendees = event.attendees.filter(
    (attendee) =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle walk-in submission
  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walkInName.trim() || !walkInEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await addWalkInAttendee(event.id, {
        name: walkInName,
        email: walkInEmail
      });

      if (success) {
        toast({
          title: "Attendee Added",
          description: "Walk-in attendee has been successfully added."
        });
        setWalkInName("");
        setWalkInEmail("");
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add walk-in attendee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" data-id="z0a0ql1jo" data-path="src/components/AttendeeList.tsx">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4" data-id="7w6a1pbt5" data-path="src/components/AttendeeList.tsx">
        <div className="relative w-full sm:w-auto" data-id="azp0ws1we" data-path="src/components/AttendeeList.tsx">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search attendees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />

        </div>
        
        {isCreator &&
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Walk-In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Walk-In Attendee</DialogTitle>
                <DialogDescription>
                  Add someone who arrived in person without an RSVP.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddWalkIn} data-id="dyn4xz2b8" data-path="src/components/AttendeeList.tsx">
                <div className="space-y-4 py-4" data-id="2mirtbnck" data-path="src/components/AttendeeList.tsx">
                  <div className="space-y-2" data-id="llsuprvou" data-path="src/components/AttendeeList.tsx">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                    id="name"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    required />

                  </div>
                  <div className="space-y-2" data-id="yb1zt5vfe" data-path="src/components/AttendeeList.tsx">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    id="email"
                    type="email"
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    required />

                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Attendee"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      </div>
      
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Attendees ({event.attendees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {event.attendees.length > 0 ?
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>RSVP Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) =>
              <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{formatDateTime(attendee.rsvpTime)}</TableCell>
                    <TableCell>
                      {attendee.attended ?
                  <div className="flex items-center" data-id="u1o6nrupy" data-path="src/components/AttendeeList.tsx">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span data-id="tl7ug7bv9" data-path="src/components/AttendeeList.tsx">Checked In</span>
                          {attendee.checkInTime &&
                    <span className="text-xs text-gray-500 ml-1" data-id="iii8r6uwj" data-path="src/components/AttendeeList.tsx">
                              ({new Date(attendee.checkInTime).toLocaleTimeString()})
                            </span>
                    }
                        </div> :

                  "Not checked in"
                  }
                    </TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table> :

          <div className="text-center py-8 text-gray-500" data-id="mucx97o4c" data-path="src/components/AttendeeList.tsx">
              <p data-id="3oj05zzss" data-path="src/components/AttendeeList.tsx">No attendees yet.</p>
            </div>
          }
        </CardContent>
      </Card>
    </div>);

};