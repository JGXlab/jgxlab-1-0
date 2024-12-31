import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg border-2 border-[#9b87f5]">
      <CardHeader className="bg-[#9b87f5] text-white py-6">
        <CardTitle className="text-3xl text-center font-bold">
          JGX Design Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-[#7E69AB] focus:ring-[#9b87f5]"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-[#7E69AB] focus:ring-[#9b87f5]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};