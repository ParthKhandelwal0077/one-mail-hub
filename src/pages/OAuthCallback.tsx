import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      // Extract code from URL parameters
      const code = searchParams.get('code');

      if (!code) {
        setStatus('error');
        setError('No authorization code received from Google');
        toast({
          title: "Error",
          description: "No authorization code received from Google",
          variant: "destructive",
        });
        return;
      }

      // Get userId from localStorage (stored before redirecting to Google)
      const userId = localStorage.getItem('gmailOAuthUserId');
      
      if (!userId) {
        setStatus('error');
        setError('User ID not found');
        toast({
          title: "Error",
          description: "User ID not found. Please try linking your account again.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Send code to backend callback endpoint
        const response = await authService.handleGmailCallback({
          code,
          userId
        });

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email account linked successfully!');
          
          // Clean up localStorage
          localStorage.removeItem('gmailOAuthUserId');
          
          toast({
            title: "Success",
            description: "Email account has been linked successfully!",
          });

          // Navigate to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error: unknown) {
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Failed to link email account';
        setError(errorMessage);
        
        // Clean up localStorage on error too
        localStorage.removeItem('gmailOAuthUserId');
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-card p-8 rounded-lg shadow-card max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-text">Completing authentication...</p>
            <p className="text-sm text-text-secondary">Please wait while we link your email account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold text-text">Success!</h2>
            <p className="text-text-secondary text-center">{message}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold text-text">Authentication Failed</h2>
            <p className="text-text-secondary text-center">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;

