import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Globe, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DesignSettings() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordProtection, setPasswordProtection] = useState(false);

  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        toast.success(`Notifications ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'darkMode':
        setDarkMode(value);
        toast.success(`Dark mode ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'twoFactor':
        setTwoFactor(value);
        toast.success(`Two-factor authentication ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'passwordProtection':
        setPasswordProtection(value);
        toast.success(`Password protection ${value ? 'enabled' : 'disabled'}`);
        break;
    }
  };

  return (
    <DesignLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Preferences Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive app notifications</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => handleToggle('notifications', checked)}
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => handleToggle('darkMode', checked)}
              />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">English (US)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={(checked) => handleToggle('twoFactor', checked)}
              />
            </div>

            {/* Password Protection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Password Protection</h3>
                  <p className="text-sm text-muted-foreground">Require password for sensitive actions</p>
                </div>
              </div>
              <Switch
                checked={passwordProtection}
                onCheckedChange={(checked) => handleToggle('passwordProtection', checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </DesignLayout>
  );
}