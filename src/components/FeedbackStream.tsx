import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Event, Feedback, submitFeedback, togglePinFeedback, toggleFlagFeedback } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Flag, Pin, ThumbsUp, ThumbsDown, Heart, Zap, Send } from "lucide-react";

interface FeedbackStreamProps {
  event: Event;
}

export const FeedbackStream: React.FC<FeedbackStreamProps> = ({ event }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(event.feedback);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<"👍" | "👎" | "❤️" | "😮" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isCreator = user?.id === event.createdBy;

  // Sort feedback with pinned items first, then by timestamp (newest first)
  const sortedFeedback = [...feedbackList].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Poll for new feedback every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would be an API call. Here we're just syncing with event prop
      setFeedbackList(event.feedback);
    }, 10000);

    return () => clearInterval(interval);
  }, [event.feedback]);

  // Scroll to bottom when new feedback is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [feedbackList.length]);

  const handleEmojiSelect = (emoji: "👍" | "👎" | "❤️" | "😮") => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  const handleSubmitFeedback = async () => {
    if (!user) return;

    if (!feedbackText.trim() && !selectedEmoji) {
      toast({
        title: "Empty Feedback",
        description: "Please enter a comment or select an emoji reaction.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const success = await submitFeedback(event.id, {
        userId: user.id,
        userName: user.name,
        text: feedbackText.trim(),
        emoji: selectedEmoji
      });

      if (success) {
        // Add the new feedback to the list (simulating real-time)
        const newFeedback: Feedback = {
          id: `temp-${Math.random().toString(36).substring(2, 9)}`,
          userId: user.id,
          userName: user.name,
          text: feedbackText.trim(),
          emoji: selectedEmoji,
          timestamp: new Date().toISOString(),
          isPinned: false,
          isFlagged: false
        };

        setFeedbackList((prev) => [...prev, newFeedback]);
        setFeedbackText("");
        setSelectedEmoji(null);
      }
    } catch (error) {
      toast({
        title: "Feedback Failed",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (feedbackId: string) => {
    try {
      const success = await togglePinFeedback(event.id, feedbackId);

      if (success) {
        // Update the pinned status locally (simulating real-time)
        setFeedbackList((prev) =>
        prev.map((f) =>
        f.id === feedbackId ? { ...f, isPinned: !f.isPinned } : f
        )
        );
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to update pin status",
        variant: "destructive"
      });
    }
  };

  const handleToggleFlag = async (feedbackId: string) => {
    try {
      const success = await toggleFlagFeedback(event.id, feedbackId);

      if (success) {
        // Update the flagged status locally (simulating real-time)
        setFeedbackList((prev) =>
        prev.map((f) =>
        f.id === feedbackId ? { ...f, isFlagged: !f.isFlagged } : f
        )
        );
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to update flag status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4" data-id="336ma0pfr" data-path="src/components/FeedbackStream.tsx">
      <div className="flex justify-between items-center" data-id="6a3jfptmm" data-path="src/components/FeedbackStream.tsx">
        <h3 className="text-xl font-semibold" data-id="cv559kkm3" data-path="src/components/FeedbackStream.tsx">Feedback Stream</h3>
        <Badge variant="outline" className="text-sm">
          {feedbackList.length} feedback items
        </Badge>
      </div>

      {/* Feedback Stream */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96 rounded-md" ref={scrollAreaRef}>
            <div className="p-4 space-y-4" data-id="024gzy6bv" data-path="src/components/FeedbackStream.tsx">
              {sortedFeedback.length > 0 ?
              sortedFeedback.map((feedback) =>
              <div
                key={feedback.id}
                className={`p-4 rounded-lg ${
                feedback.isPinned ?
                "bg-purple-50 border border-purple-200" :
                feedback.isFlagged ?
                "bg-red-50 border border-red-200 opacity-60" :
                "bg-gray-50"}`
                } data-id="595ezgw0u" data-path="src/components/FeedbackStream.tsx">

                    <div className="flex justify-between items-start" data-id="pq6ochqka" data-path="src/components/FeedbackStream.tsx">
                      <div className="flex items-center" data-id="s3hq6yb13" data-path="src/components/FeedbackStream.tsx">
                        <div className="font-medium" data-id="jqzd26xxl" data-path="src/components/FeedbackStream.tsx">{feedback.userName}</div>
                        {feedback.isPinned &&
                    <Badge variant="secondary" className="ml-2">
                            Pinned
                          </Badge>
                    }
                      </div>
                      {isCreator &&
                  <div className="flex space-x-1" data-id="vaq3oklrf" data-path="src/components/FeedbackStream.tsx">
                          <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleTogglePin(feedback.id)}
                      title={feedback.isPinned ? "Unpin" : "Pin"}>

                            <Pin
                        size={16}
                        className={feedback.isPinned ? "text-purple-600" : "text-gray-400"} />

                          </Button>
                          <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleFlag(feedback.id)}
                      title={feedback.isFlagged ? "Unflag" : "Flag as inappropriate"}>

                            <Flag
                        size={16}
                        className={feedback.isFlagged ? "text-red-600" : "text-gray-400"} />

                          </Button>
                        </div>
                  }
                    </div>
                    
                    {feedback.text &&
                <p className="mt-2 text-gray-700" data-id="5achq8r0a" data-path="src/components/FeedbackStream.tsx">{feedback.text}</p>
                }
                    
                    {feedback.emoji &&
                <div className="mt-2 text-2xl" data-id="nkesthf02" data-path="src/components/FeedbackStream.tsx">{feedback.emoji}</div>
                }
                    
                    <div className="mt-2 text-xs text-gray-500" data-id="4tnjrdggt" data-path="src/components/FeedbackStream.tsx">
                      {new Date(feedback.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
              ) :

              <div className="text-center py-8 text-gray-500" data-id="sj3fzvv3s" data-path="src/components/FeedbackStream.tsx">
                  <p data-id="qejdozid0" data-path="src/components/FeedbackStream.tsx">No feedback yet. Be the first to share your thoughts!</p>
                </div>
              }
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Feedback Input */}
      {user &&
      <Card>
          <CardContent className="p-4">
            <div className="space-y-4" data-id="319gzp7eh" data-path="src/components/FeedbackStream.tsx">
              <Textarea
              placeholder="Share your thoughts or questions..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={2}
              disabled={submitting} />

              
              <div className="flex flex-col sm:flex-row gap-3 justify-between" data-id="sqbysfcq6" data-path="src/components/FeedbackStream.tsx">
                <div className="flex space-x-2" data-id="ipxjs097i" data-path="src/components/FeedbackStream.tsx">
                  <Button
                  variant={selectedEmoji === "👍" ? "default" : "outline"}
                  size="sm"
                  className={selectedEmoji === "👍" ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800" : ""}
                  onClick={() => handleEmojiSelect("👍")}
                  disabled={submitting}>

                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span data-id="j4d5yqwk0" data-path="src/components/FeedbackStream.tsx">👍</span>
                  </Button>
                  <Button
                  variant={selectedEmoji === "👎" ? "default" : "outline"}
                  size="sm"
                  className={selectedEmoji === "👎" ? "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800" : ""}
                  onClick={() => handleEmojiSelect("👎")}
                  disabled={submitting}>

                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span data-id="4xyqyocf7" data-path="src/components/FeedbackStream.tsx">👎</span>
                  </Button>
                  <Button
                  variant={selectedEmoji === "❤️" ? "default" : "outline"}
                  size="sm"
                  className={selectedEmoji === "❤️" ? "bg-pink-100 text-pink-700 hover:bg-pink-200 hover:text-pink-800" : ""}
                  onClick={() => handleEmojiSelect("❤️")}
                  disabled={submitting}>

                    <Heart className="h-4 w-4 mr-1" />
                    <span data-id="p3jcy02g2" data-path="src/components/FeedbackStream.tsx">❤️</span>
                  </Button>
                  <Button
                  variant={selectedEmoji === "😮" ? "default" : "outline"}
                  size="sm"
                  className={selectedEmoji === "😮" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800" : ""}
                  onClick={() => handleEmojiSelect("😮")}
                  disabled={submitting}>

                    <Zap className="h-4 w-4 mr-1" />
                    <span data-id="k0zlppxdr" data-path="src/components/FeedbackStream.tsx">😮</span>
                  </Button>
                </div>
                
                <Button
                className="flex items-center"
                onClick={handleSubmitFeedback}
                disabled={submitting || !feedbackText.trim() && !selectedEmoji}>

                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? "Sending..." : "Send Feedback"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};