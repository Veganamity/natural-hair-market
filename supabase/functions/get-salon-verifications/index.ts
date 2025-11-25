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

    // Get status filter from request
    const { status_filter } = await req.json().catch(() => ({ status_filter: null }));

    // Query using service role (bypasses RLS and cache)
    let query = supabase
      .from('salon_verifications')
      .select(`
        id,
        user_id,
        salon_name,
        siret,
        address,
        phone,
        status,
        created_at,
        profiles:user_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (status_filter && status_filter !== 'all') {
      query = query.eq('status', status_filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Query error:', error);
      throw error;
    }

    // Transform data to match expected format
    const transformedData = data.map(item => ({
      ...item,
      profiles: Array.isArray(item.profiles) && item.profiles.length > 0 
        ? item.profiles[0] 
        : item.profiles
    }));

    return new Response(JSON.stringify(transformedData), {
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