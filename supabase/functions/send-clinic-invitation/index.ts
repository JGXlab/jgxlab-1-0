import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  clinicName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, clinicName }: InviteRequest = await req.json();

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (authError) {
      throw new Error(`Error creating user: ${authError.message}`);
    }

    // Send welcome email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>", // Update this with your verified domain
        to: [email],
        subject: "Welcome to Your New Clinic Portal",
        html: `
          <h1>Welcome to ${clinicName}!</h1>
          <p>You've been invited to join the clinic portal. Click the link below to set up your password and access your account:</p>
          <p><a href="${authUser?.user?.confirmation_sent_at}">Set Up Your Password</a></p>
          <p>If you didn't request this invitation, please ignore this email.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send invitation email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-clinic-invitation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);