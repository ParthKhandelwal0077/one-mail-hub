import { useState } from "react";
import EmailCard from "./EmailCard";
import { Email, EmailFilter } from "@/types/email";

// Mock data
const mockEmails: Email[] = [
  // {
  //   id: "1",
  //   subject: "Q4 Product Launch Strategy",
  //   sender: "Sarah Johnson",
  //   senderEmail: "sarah@company.com",
  //   preview: "I'd love to discuss the upcoming product launch and coordinate our marketing efforts...",
  //   body: "Hi there, I'd love to discuss the upcoming product launch and coordinate our marketing efforts. Let me know when you're available for a quick call this week.",
  //   date: new Date("2025-01-05T10:30:00"),
  //   category: "interested",
  //   account: "work@email.com",
  //   isRead: false,
  //   hasAttachments: true,
  // },
  // {
  //   id: "2",
  //   subject: "Meeting Scheduled: Project Review",
  //   sender: "Michael Chen",
  //   senderEmail: "michael@startup.io",
  //   preview: "Your meeting has been confirmed for tomorrow at 2 PM...",
  //   body: "Your meeting has been confirmed for tomorrow at 2 PM. Please find the calendar invite attached.",
  //   date: new Date("2025-01-05T09:15:00"),
  //   category: "meeting",
  //   account: "personal@email.com",
  //   isRead: true,
  //   hasAttachments: false,
  // },
  // {
  //   id: "3",
  //   subject: "Partnership Opportunity",
  //   sender: "Emma Williams",
  //   senderEmail: "emma@agency.com",
  //   preview: "Thank you for reaching out. Unfortunately, we're not pursuing new partnerships at this time...",
  //   body: "Thank you for reaching out. Unfortunately, we're not pursuing new partnerships at this time. We'll keep your information on file for future opportunities.",
  //   date: new Date("2025-01-05T08:45:00"),
  //   category: "not-interested",
  //   account: "work@email.com",
  //   isRead: true,
  //   hasAttachments: false,
  // },
  // {
  //   id: "4",
  //   subject: "URGENT: Claim Your Prize Now!!!",
  //   sender: "no-reply@spam.com",
  //   senderEmail: "noreply@spam.com",
  //   preview: "Congratulations! You've won $1,000,000! Click here now...",
  //   body: "Congratulations! You've won $1,000,000! Click here now to claim your prize. Limited time offer!",
  //   date: new Date("2025-01-04T16:20:00"),
  //   category: "spam",
  //   account: "personal@email.com",
  //   isRead: false,
  //   hasAttachments: false,
  // },
  // {
  //   id: "5",
  //   subject: "Out of Office: Annual Leave",
  //   sender: "David Lee",
  //   senderEmail: "david@company.com",
  //   preview: "Thank you for your email. I am currently out of office until January 15th...",
  //   body: "Thank you for your email. I am currently out of office until January 15th and will have limited access to email. For urgent matters, please contact my colleague at backup@company.com.",
  //   date: new Date("2025-01-04T14:30:00"),
  //   category: "ooo",
  //   account: "work@email.com",
  //   isRead: true,
  //   hasAttachments: false,
  // },
];

interface EmailListProps {
  filters: EmailFilter;
}

const EmailList = ({ filters }: EmailListProps) => {
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  // Filter emails based on current filters
  const filteredEmails = mockEmails.filter((email) => {
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
