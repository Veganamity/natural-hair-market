import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    if (user.email !== 'stephaniebuisson1115@gmail.com') {
      throw new Error('Access denied: admin privileges required');
    }

    // Get verification_id and user_id from request
    const { verification_id, user_id } = await req.json();

    if (!verification_id || !user_id) {
      throw new Error('verification_id and user_id are required');
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from('salon_verifications')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', verification_id);

    if (updateError) throw updateError;

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_certified_salon: true })
      .eq('id', user_id);

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});