import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the admin user making the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    
    const { data: { user: adminUser }, error: verifyError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (verifyError) throw verifyError
    
    // Verify admin role
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminUser?.id)
      .single()
    
    if (profileError) throw profileError
    if (adminProfile.role !== 'admin') throw new Error('Unauthorized: Not an admin')

    // Get clinic user ID from request
    const { clinicUserId } = await req.json()
    if (!clinicUserId) throw new Error('No clinic user ID provided')

    // Generate a magic link token for the clinic user
    const { data, error: signInError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: clinicUserId,
    })
    
    if (signInError) throw signInError

    return new Response(
      JSON.stringify({ token: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})