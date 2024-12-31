import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
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
      console.log("Attempting to sign in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error details:", error);
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email inbox and click the verification link to activate your account.",
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
          title: "Welcome back",
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
    <Card className="w-full max-w-[420px] mx-auto bg-white shadow-lg rounded-3xl border-0">
      <CardContent className="p-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sign In</h1>
          <p className="text-gray-500">Welcome back! Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded-md border-gray-300" />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Remember for 30 Days
              </label>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600 hover:text-blue-700"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};
