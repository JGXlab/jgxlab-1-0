import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Globe, Mail } from "lucide-react";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual registration
    console.log("Registration attempt:", { email });
    
    toast({
      title: "Account created",
      description: "You can now sign in with your credentials.",
    });
    
    navigate("/");
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
          <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
          <p className="text-gray-500">Please enter your details to sign up</p>
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
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#8b74f8] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#9b87f5]"
            onClick={() => navigate("/")}
          >
            Sign in
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};