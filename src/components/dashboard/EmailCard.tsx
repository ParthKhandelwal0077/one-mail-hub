import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Clock,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
} from "lucide-react";
import { Email } from "@/types/email";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EmailCardProps {
  email: Email;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const categoryConfig = {
  interested: { label: "Interested", color: "bg-category-interested" },
  meeting: { label: "Meeting Booked", color: "bg-category-meeting" },
  "not-interested": { label: "Not Interested", color: "bg-category-not-interested" },
  spam: { label: "Spam", color: "bg-category-spam" },
  ooo: { label: "Out of Office", color: "bg-category-ooo" },
  uncategorized: { label: "Uncategorized", color: "bg-category-uncategorized" },
};

const EmailCard = ({ email, isExpanded, onToggleExpand }: EmailCardProps) => {
  const [showAIReply, setShowAIReply] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleGenerateAIReply = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setAiReply(
        `Hi ${email.sender},\n\nThank you for reaching out regarding "${email.subject}". I appreciate you taking the time to connect.\n\nI'd be happy to discuss this further. Would you be available for a brief call this week to explore this opportunity?\n\nLooking forward to hearing from you.\n\nBest regards`
      );
      setIsGenerating(false);
      setShowAIReply(true);
    }, 1500);
  };

  const handleSendReply = () => {
    toast({
      title: "Reply Sent",
      description: "Your AI-generated reply has been sent successfully.",
    });
    setShowAIReply(false);
    setAiReply("");
  };

  const category = categoryConfig[email.category];

  return (
    <div
      className={`bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${
        !email.isRead ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div
        className="p-6 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-text-primary truncate">
                {email.subject}
              </h3>
              {!email.isRead && (
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="font-medium">{email.sender}</span>
              <span className="text-text-tertiary">•</span>
              <span className="text-text-tertiary">{email.senderEmail}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="flex-shrink-0">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {email.preview}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <span className={`w-2 h-2 rounded-full ${category.color}`} />
              {category.label}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Mail className="h-3 w-3" />
              {email.account}
            </Badge>
            {email.hasAttachments && (
              <Badge variant="secondary" className="gap-1">
                <Paperclip className="h-3 w-3" />
                Attachments
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-text-tertiary text-sm">
            <Clock className="h-4 w-4" />
            <span>{formatDate(email.date)}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border animate-expand">
          <div className="p-6 bg-surface/50">
            <p className="text-text-primary whitespace-pre-wrap mb-6">{email.body}</p>
            
            <div className="flex gap-3">
              <Button
                variant="default"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateAIReply();
                }}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Reply with AI"}
              </Button>
            </div>
          </div>

          {showAIReply && (
            <div className="p-6 border-t border-border bg-card animate-expand">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-text-primary">AI Generated Reply</h4>
              </div>
              <Textarea
                value={aiReply}
                onChange={(e) => setAiReply(e.target.value)}
                className="mb-4 min-h-[200px]"
                placeholder="Your AI-generated reply will appear here..."
              />
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendReply();
                  }}
                >
                  <Send className="h-4 w-4" />
                  Send Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAIReply(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailCard;
