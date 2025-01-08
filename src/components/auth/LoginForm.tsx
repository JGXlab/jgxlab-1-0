import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session and role on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Active session found, checking user role");
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'clinic') {
            console.log("Valid clinic user found, redirecting to dashboard");
            navigate("/clinic/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();
  }, [navigate]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile?.role === 'clinic') {
            console.log("Clinic role confirmed, redirecting to dashboard");
            navigate("/clinic/dashboard", { replace: true });
          } else {
            console.log("Non-clinic user detected, signing out");
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You do not have permission to access the clinic portal.",
            });
          }
        } catch (error) {
          console.error("Profile check error:", error);
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while checking your permissions.",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      console.log("Attempting to sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email and verify your account before logging in.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
          });
        }
        return;
      }

      if (data.user) {
        console.log("Login successful, checking user role");
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.role === 'clinic') {
          console.log("Clinic role confirmed, redirecting to dashboard");
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your account.",
          });
          navigate("/clinic/dashboard", { replace: true });
        } else {
          console.log("Non-clinic user detected, signing out");
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permission to access the clinic portal.",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-[420px] shadow-lg rounded-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-11 pr-10"
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
              className="w-full h-11 text-base font-medium"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}