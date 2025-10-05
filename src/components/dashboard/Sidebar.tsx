import { Button } from "@/components/ui/button";
import {
  Mail,
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Settings,
  Plus,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleLinkAccount = (type: string) => {
    toast({
      title: "Coming Soon",
      description: `${type} account linking will be available soon.`,
    });
  };

  const navItems = [
    { icon: Inbox, label: "Inbox", badge: "12" },
    { icon: Star, label: "Starred", badge: null },
    { icon: Send, label: "Sent", badge: null },
    { icon: Archive, label: "Archive", badge: null },
    { icon: Trash2, label: "Trash", badge: null },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">oneMail</h1>
      </div>

      <div className="px-4 space-y-2">
        <Button
          variant="default"
          className="w-full justify-start gap-2"
          onClick={() => handleLinkAccount("Email")}
        >
          <Plus className="h-4 w-4" />
          Link Email Account
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => handleLinkAccount("Slack")}
        >
          <MessageSquare className="h-4 w-4" />
          Link Slack
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
