import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Starting admin login process...");
      
      // First, attempt to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: signInError.message,
        });
        return;
      }

      if (!signInData.user) {
        console.error("No user data returned after sign in");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Unable to retrieve user information",
        });
        return;
      }

      console.log("User signed in successfully, checking admin status...");

      // Check admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Could not verify admin status",
        });
        return;
      }

      if (!profileData?.is_admin) {
        console.log("Non-admin user attempted to login");
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This account does not have admin privileges",
        });
        return;
      }

      console.log("Admin login successful, redirecting...");
      toast({
        title: "Welcome Admin",
        description: "Successfully logged in to admin panel",
      });
      navigate("/admin/dashboard");
      
    } catch (error) {
      console.error("Unexpected admin login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-[420px] mx-auto bg-white shadow-lg rounded-3xl border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
            <p className="text-gray-500">Enter your credentials to access admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-gray-50/50 border-gray-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;