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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { salon_name, siret, address, phone } = await req.json();

    const cleanedSiret = siret.replace(/\s/g, '');

    if (!/^\d{14}$/.test(cleanedSiret)) {
      throw new Error('Le SIRET doit contenir exactement 14 chiffres');
    }

    const { data: existingRequest } = await supabase
      .from('salon_verifications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let data;
    let error;

    if (existingRequest && existingRequest.status !== 'approved') {
      const result = await supabase
        .from('salon_verifications')
        .update({
          salon_name,
          siret: cleanedSiret,
          address,
          phone: phone || null,
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRequest.id)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else if (!existingRequest) {
      const result = await supabase
        .from('salon_verifications')
        .insert({
          user_id: user.id,
          salon_name,
          siret: cleanedSiret,
          address,
          phone: phone || null,
          status: 'pending'
        })
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      throw new Error('Votre demande a déjà été approuvée');
    }

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});