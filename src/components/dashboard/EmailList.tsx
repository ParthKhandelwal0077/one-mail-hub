import { useState, useMemo } from "react";
import EmailCard from "./EmailCard";
import { Email, EmailFilter, EmailMessage } from "@/types/email";
import { useWebSocket } from "@/contexts/WebSocketContext";

// Helper function to convert EmailMessage to Email
const convertEmailMessageToEmail = (message: EmailMessage): Email => {
  return {
    id: message.uid,
    subject: message.subject,
    sender: message.from,
    senderEmail: message.email,
    preview: message.body.substring(0, 100) + (message.body.length > 100 ? '...' : ''),
    body: message.body,
    date: new Date(message.date),
    category: message.category,
    account: message.email,
    isRead: message.isRead ?? false,
    hasAttachments: false, // WebSocket messages don't provide this info
  };
};

interface EmailListProps {
  filters: EmailFilter;
}

const EmailList = ({ filters }: EmailListProps) => {
  const { emails: wsEmails } = useWebSocket();
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  // Convert WebSocket emails to Email format and apply filters
  const filteredEmails = useMemo(() => {
    const convertedEmails = wsEmails.map(convertEmailMessageToEmail);
    
    return convertedEmails.filter((email) => {
      if (filters.category && email.category !== filters.category) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          email.subject.toLowerCase().includes(query) ||
          email.sender.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [wsEmails, filters]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4 animate-fade-in">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No emails found matching your filters.
          </div>
        ) : (
          filteredEmails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isExpanded={expandedEmailId === email.id}
              onToggleExpand={() =>
                setExpandedEmailId(expandedEmailId === email.id ? null : email.id)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
