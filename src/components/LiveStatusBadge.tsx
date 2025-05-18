import React from "react";
import { Badge } from "@/components/ui/badge";

type LiveStatusBadgeProps = {
  status: "live" | "upcoming" | "closed";
};

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "live":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <span className="mr-1 animate-pulse inline-block h-2 w-2 rounded-full bg-white" data-id="uwr4a6x5s" data-path="src/components/LiveStatusBadge.tsx"></span>
          Live Now
        </Badge>);

    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>;
    case "closed":
      return <Badge variant="outline">Closed</Badge>;
    default:
      return null;
  }
};