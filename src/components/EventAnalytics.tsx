import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEventAnalytics } from "../services/eventService";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EventAnalyticsProps {
  eventId: string;
}

export const EventAnalytics: React.FC<EventAnalyticsProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<{
    totalRSVPs: number;
    totalCheckIns: number;
    checkInPercentage: number;
    feedbackCount: number;
    emojiCounts: Record<string, number>;
    feedbackTimeline: Array<{timestamp: string;count: number;}>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getEventAnalytics(eventId);
        setAnalytics(data);
      } catch (error) {
        toast({
          title: "Error Loading Analytics",
          description: "There was a problem loading the event analytics.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId, toast]);

  // Format timestamp for display on chart
  const formatTimelineData = (timeline: Array<{timestamp: string;count: number;}>) => {
    return timeline.map((item) => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  // Prepare emoji data for chart
  const prepareEmojiData = (emojiCounts: Record<string, number>) => {
    return Object.entries(emojiCounts).
    filter(([_, count]) => count > 0) // Only include emojis with counts > 0
    .map(([emoji, count]) => ({
      emoji,
      count
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6" data-id="8ssxzirsi" data-path="src/components/EventAnalytics.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="7l3n0h0lo" data-path="src/components/EventAnalytics.tsx">
          {[1, 2, 3].map((i) =>
          <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" data-id="tl6we21t3" data-path="src/components/EventAnalytics.tsx"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-200 rounded w-2/3" data-id="y78xd6ozm" data-path="src/components/EventAnalytics.tsx"></div>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-gray-200 rounded w-1/4" data-id="7bxy89xh5" data-path="src/components/EventAnalytics.tsx"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded" data-id="t45f48mbl" data-path="src/components/EventAnalytics.tsx"></div>
          </CardContent>
        </Card>
      </div>);

  }

  if (!analytics) {
    return (
      <div className="text-center py-8" data-id="pdc9x27e8" data-path="src/components/EventAnalytics.tsx">
        <p className="text-gray-500" data-id="6vi41hjz0" data-path="src/components/EventAnalytics.tsx">No analytics data available.</p>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="i6zvk22ff" data-path="src/components/EventAnalytics.tsx">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="a2g61w6kn" data-path="src/components/EventAnalytics.tsx">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ATTENDANCE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-id="rl482iqoz" data-path="src/components/EventAnalytics.tsx">
              {analytics.totalCheckIns} / {analytics.totalRSVPs}
            </div>
            <p className="text-xs text-gray-500 mt-1" data-id="9abv90o54" data-path="src/components/EventAnalytics.tsx">
              {analytics.checkInPercentage.toFixed(0)}% check-in rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">FEEDBACK ITEMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-id="ok39by4kg" data-path="src/components/EventAnalytics.tsx">{analytics.feedbackCount}</div>
            <p className="text-xs text-gray-500 mt-1" data-id="7aawznwrt" data-path="src/components/EventAnalytics.tsx">
              Total comments and reactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">TOP REACTION</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(analytics.emojiCounts).length > 0 ?
            <>
                <div className="text-2xl font-bold flex items-center" data-id="w7f3nf1j5" data-path="src/components/EventAnalytics.tsx">
                  {Object.entries(analytics.emojiCounts).
                sort((a, b) => b[1] - a[1])[0][0]}{" "}
                  <span className="ml-2 text-lg" data-id="70kx6omvw" data-path="src/components/EventAnalytics.tsx">
                    {Object.entries(analytics.emojiCounts).
                  sort((a, b) => b[1] - a[1])[0][1]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1" data-id="zko6miti4" data-path="src/components/EventAnalytics.tsx">Most common reaction</p>
              </> :

            <div className="text-gray-500" data-id="zly1w72nc" data-path="src/components/EventAnalytics.tsx">No reactions yet</div>
            }
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="myoqpw5ty" data-path="src/components/EventAnalytics.tsx">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Emoji Reactions</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.values(analytics.emojiCounts).some((count) => count > 0) ?
            <div className="h-64" data-id="um1rswbju" data-path="src/components/EventAnalytics.tsx">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                  data={prepareEmojiData(analytics.emojiCounts)}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                    dataKey="emoji"
                    tick={{ fontSize: 16 }} />

                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div> :

            <div className="flex items-center justify-center h-64 text-gray-500" data-id="iw2hvgt5t" data-path="src/components/EventAnalytics.tsx">
                No emoji reactions yet
              </div>
            }
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Feedback Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.feedbackTimeline.length > 0 ?
            <div className="h-64" data-id="a2eprfxbo" data-path="src/components/EventAnalytics.tsx">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                  data={formatTimelineData(analytics.feedbackTimeline)}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                    type="monotone"
                    dataKey="count"
                    name="Feedback Items"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }} />

                  </LineChart>
                </ResponsiveContainer>
              </div> :

            <div className="flex items-center justify-center h-64 text-gray-500" data-id="lvtg8vosb" data-path="src/components/EventAnalytics.tsx">
                No feedback data yet
              </div>
            }
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" data-id="z2cq1oxie" data-path="src/components/EventAnalytics.tsx">
            <div className="flex items-center justify-between" data-id="90fl9d9f9" data-path="src/components/EventAnalytics.tsx">
              <span className="text-sm font-medium" data-id="35v0yzp5c" data-path="src/components/EventAnalytics.tsx">RSVPs</span>
              <span className="font-bold" data-id="46nson930" data-path="src/components/EventAnalytics.tsx">{analytics.totalRSVPs}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between" data-id="cp4knqv8q" data-path="src/components/EventAnalytics.tsx">
              <span className="text-sm font-medium" data-id="5n1w3ewjk" data-path="src/components/EventAnalytics.tsx">Check-ins</span>
              <span className="font-bold" data-id="t6tvkqqcn" data-path="src/components/EventAnalytics.tsx">{analytics.totalCheckIns}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between" data-id="0gc423cyf" data-path="src/components/EventAnalytics.tsx">
              <span className="text-sm font-medium" data-id="88o1u9anf" data-path="src/components/EventAnalytics.tsx">No-shows</span>
              <span className="font-bold" data-id="cdlnmho6k" data-path="src/components/EventAnalytics.tsx">
                {analytics.totalRSVPs - analytics.totalCheckIns}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between" data-id="0wjbmzu9g" data-path="src/components/EventAnalytics.tsx">
              <span className="text-sm font-medium" data-id="ffx88yho6" data-path="src/components/EventAnalytics.tsx">Check-in Rate</span>
              <span className="font-bold" data-id="hif9iyp0c" data-path="src/components/EventAnalytics.tsx">
                {analytics.checkInPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};