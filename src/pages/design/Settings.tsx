import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DesignSettings() {
  const [notifications, setNotifications] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('English (US)');

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load notification preference from localStorage
    const savedNotifications = localStorage.getItem('notifications') === 'true';
    setNotifications(savedNotifications);
  }, []);

  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        localStorage.setItem('notifications', value.toString());
        if (value) {
          // Request notification permission
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              toast.success('Notifications enabled');
            } else {
              toast.error('Notification permission denied');
              setNotifications(false);
              localStorage.setItem('notifications', 'false');
            }
          });
        } else {
          toast.success('Notifications disabled');
        }
        break;
      case 'darkMode':
        setTheme(value ? 'dark' : 'light');
        toast.success(`Dark mode ${value ? 'enabled' : 'disabled'}`);
        break;
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage}`);
    // Here you would typically integrate with an i18n library
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) return null;

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
                checked={theme === 'dark'}
                onCheckedChange={(checked) => handleToggle('darkMode', checked)}
              />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">{language}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Language</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLanguageChange('English (US)')}>
                    English (US)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('English (UK)')}>
                    English (UK)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('Spanish')}>
                    Spanish
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('French')}>
                    French
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </div>
    </DesignLayout>
  );
}