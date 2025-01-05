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
      console.log("Attempting admin login with email:", email);
      
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
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

      if (!user) {
        console.error("No user data returned after sign in");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Authentication failed. Please try again.",
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify admin access.",
        });
        return;
      }

      if (!profile || profile.role !== 'admin') {
        console.error("User is not an admin");
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have admin privileges.",
        });
        return;
      }

      console.log("Admin login successful, redirecting to dashboard");
      toast({
        title: "Welcome Admin",
        description: "Successfully logged in to admin panel",
      });
      navigate("/admin/dashboard");
      
    } catch (error) {
      console.error("Unexpected error during login:", error);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F6F7]">
      <Card className="w-full max-w-[420px] mx-auto bg-gradient-to-br from-white to-accent/30 border-none shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-[#8B5CF6]" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 transition-all duration-200 hover:bg-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 pr-10 transition-all duration-200 hover:bg-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
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
              className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-medium shadow-lg shadow-[#8B5CF6]/20 transition-all duration-200"
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