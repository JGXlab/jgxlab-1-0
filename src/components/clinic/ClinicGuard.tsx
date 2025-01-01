import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return data;
}

export function ClinicGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'clinic')) {
      navigate('/admin/login');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return profile?.role === 'clinic' ? <>{children}</> : null;
}