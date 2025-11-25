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

    // Build query
    let query = `
      SELECT
        sv.id,
        sv.user_id,
        sv.salon_name,
        sv.siret,
        sv.address,
        sv.phone,
        sv.status,
        sv.created_at,
        jsonb_build_object(
          'email', p.email,
          'full_name', p.full_name
        ) as profiles
      FROM salon_verifications sv
      LEFT JOIN profiles p ON sv.user_id = p.id
    `;

    if (status_filter && status_filter !== 'all') {
      query += ` WHERE sv.status = '${status_filter}'`;
    }

    query += ` ORDER BY sv.created_at DESC`;

    // Execute raw SQL query using service role
    const { data, error } = await supabase.rpc('exec_sql', { query_text: query }).single();

    if (error) {
      // If exec_sql doesn't exist, use direct query
      const result = await supabase
        .from('salon_verifications')
        .select(`
          *,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (status_filter && status_filter !== 'all') {
        result.eq('status', status_filter);
      }

      const { data: fallbackData, error: fallbackError } = result;

      if (fallbackError) throw fallbackError;

      return new Response(JSON.stringify(fallbackData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(data), {
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