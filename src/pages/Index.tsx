import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Inbox, Sparkles, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary mb-4">oneMail</h1>
          <p className="text-xl text-text-secondary mb-8">
            Your unified email experience. All accounts, one beautiful interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-card p-8 rounded-2xl shadow-card">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Inbox className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unified Inbox</h3>
            <p className="text-text-secondary">
              Connect all your email accounts and manage them from one beautiful dashboard.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-card">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Replies</h3>
            <p className="text-text-secondary">
              Generate intelligent, context-aware email responses with a single click.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-card">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
            <p className="text-text-secondary">
              Automatically categorize emails to focus on what matters most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
