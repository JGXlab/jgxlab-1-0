import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  // Check for valid session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Checking session status:", session ? "Active" : "No session");
      
      if (error || !session) {
        console.error("Session error:", error);
        toast.error("Please log in again to change your password");
        navigate("/admin/login");
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsPending(true);

    try {
      console.log("Attempting to update password...");
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        if (error.message.includes("refresh_token_not_found")) {
          toast.error("Session expired. Please log in again.");
          navigate("/admin/login");
        } else {
          toast.error(error.message);
        }
        return;
      }

      console.log("Password updated successfully");
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isPending}
        >
          {isPending ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}