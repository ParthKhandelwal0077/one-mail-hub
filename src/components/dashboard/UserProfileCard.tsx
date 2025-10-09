import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UpdateProfileRequest } from '@/types/auth';
import { 
  User, 
  Phone, 
  Calendar, 
  Settings, 
  BarChart3,
  Clock,
  Mail,
  MessageSquare,
  Globe
} from 'lucide-react';

const UserProfileCard: React.FC = () => {
  const { user, userProfile, userStats } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-text-tertiary" />
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-text-secondary">{userProfile?.phoneNumber || user.phoneNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-text-tertiary" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-text-secondary">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-text-tertiary" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-text-secondary">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {userProfile?.slackWebhookUrl && (
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-text-tertiary" />
              <div>
                <p className="text-sm font-medium">Slack Integration</p>
                <Badge variant="secondary">Connected</Badge>
              </div>
            </div>
          )}

          {userProfile?.customWebhookUrl && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-text-tertiary" />
              <div>
                <p className="text-sm font-medium">Custom Webhook</p>
                <Badge variant="secondary">Configured</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {userStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-surface rounded-lg">
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">{userStats.totalEmails}</p>
                <p className="text-sm text-text-secondary">Total Emails</p>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">{userStats.categorizedEmails}</p>
                <p className="text-sm text-text-secondary">Categorized</p>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-lg">
                <Mail className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-2xl font-bold text-destructive">{userStats.spamEmails}</p>
                <p className="text-sm text-text-secondary">Spam</p>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-bold text-primary">
                  {new Date(userStats.lastLoginAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-text-secondary">Last Login</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Update Profile
            </Button>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
            <Button variant="outline" size="sm">
              Account Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileCard;
