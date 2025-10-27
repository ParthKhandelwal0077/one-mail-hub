import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { EmailAccount } from "@/types/auth";
import { Mail, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";

interface LinkEmailAccountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LinkEmailAccount = ({ open, onOpenChange }: LinkEmailAccountProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const fetchEmailAccounts = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.getEmailAccountStatus(user.id);
      if (response.success) {
        setEmailAccounts(response.data.emails || []);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch email accounts";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchEmailAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const isTokenExpiringSoon = (tokenExpiry: string) => {
    try {
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 7; // Expiring within 7 days
    } catch {
      return false;
    }
  };

  const handleLinkNewAccount = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsLinking(true);
    try {
      // Get Gmail auth URL from backend
      const response = await authService.getGmailAuthUrl();
      
      if (response.success && response.data.authUrl) {
        // Store userId in localStorage for callback retrieval
        localStorage.setItem('gmailOAuthUserId', user.id);
        
        // Close the dialog
        onOpenChange(false);
        
        // Redirect to Google OAuth
        window.location.href = response.data.authUrl;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate Gmail linking";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleRefresh = () => {
    fetchEmailAccounts();
    toast({
      title: "Refreshed",
      description: "Email accounts list has been updated.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Accounts
          </DialogTitle>
          <DialogDescription>
            Manage your linked email accounts and view their authentication status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : emailAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No email accounts linked</p>
              <p className="text-sm text-muted-foreground">
                Link your first email account to get started
              </p>
            </div>
          ) : (
            emailAccounts.map((account, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base">{account.email}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {account.hasRefreshToken ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Token Expiry:</span>
                      <span
                        className={
                          isTokenExpiringSoon(account.tokenExpiry)
                            ? "text-orange-500 font-medium"
                            : "text-foreground"
                        }
                      >
                        {formatDate(account.tokenExpiry)}
                      </span>
                    </div>
                    {account.hasRefreshToken && isTokenExpiringSoon(account.tokenExpiry) && (
                      <p className="text-xs text-orange-500 mt-2">
                        ⚠️ Token expiring soon. You may need to re-authenticate.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isLinking || !emailAccounts.length}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleLinkNewAccount} disabled={isLoading || isLinking}>
            {isLinking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Link New Email Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkEmailAccount;

