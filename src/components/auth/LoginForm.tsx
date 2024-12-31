import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Globe, Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error details:", error);
        
        // Check if the error is due to unconfirmed email
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email inbox and click the verification link to activate your account. If you need a new verification email, please register again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
          });
        }
      } else {
        console.log("Login successful, redirecting...");
        toast({
          title: "Welcome to JGX Design Lab",
          description: "Successfully logged in to your account.",
        });
        navigate("/clinic/dashboard");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl rounded-3xl border-0">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-[#9b87f5]/10 rounded-2xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-[#9b87f5]" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">Welcome back</h1>
          <p className="text-[#403E43]">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1F2C]">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#F1F0FB] border-0 focus:ring-2 focus:ring-[#9b87f5]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1F2C]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-[#F1F0FB] border-0 focus:ring-2 focus:ring-[#9b87f5]"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="text-[#9b87f5] border-2 data-[state=checked]:bg-[#9b87f5]" />
              <label
                htmlFor="remember"
                className="text-sm text-[#403E43] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember for 30 days
              </label>
            </div>
            <Button variant="link" className="p-0 h-auto text-[#9b87f5] hover:text-[#8b74f8]">
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#8b74f8] text-white h-11 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#403E43]">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#9b87f5] hover:text-[#8b74f8]"
            onClick={() => navigate("/register")}
          >
            Create account
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};