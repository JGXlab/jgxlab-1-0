import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClinicAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  // Check for existing session and role on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Active session found, checking user role");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

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

  const signIn = async (email: string, password: string) => {
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

  return { signIn, isPending };
};