import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Apple, Facebook, Globe, Google } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual authentication
    console.log("Login attempt:", { email });
    
    // Temporary mock login for demonstration
    if (email.includes("clinic")) {
      navigate("/clinic/dashboard");
      toast({
        title: "Welcome to JGX Design Lab",
        description: "Successfully logged in to your clinic account.",
      });
    } else if (email.includes("designer")) {
      navigate("/designer/dashboard");
      toast({
        title: "Welcome to JGX Design Lab",
        description: "Successfully logged in to your designer account.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-3xl">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#9b87f5]/10 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#9b87f5]" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-500">Please enter your details to sign in</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log("Google login clicked")}
          >
            <Google className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log("Apple login clicked")}
          >
            <Apple className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log("Facebook login clicked")}
          >
            <Facebook className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Email address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember for 30 days
              </label>
            </div>
            <Button variant="link" className="p-0 h-auto text-[#9b87f5]">
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#8b74f8] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto text-[#9b87f5]">
            Create account
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};