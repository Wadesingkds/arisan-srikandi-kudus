import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
  sender: string;
}

interface WhatsAppTestRequest {
  to: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          storage: undefined,
          detectSessionInUrl: false,
          persistSession: false,
        },
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Set the auth token
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    })

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    if (req.method === 'POST') {
      const body = await req.json()

      switch (action) {
        case 'save-config': {
          const { apiKey, apiUrl, sender }: WhatsAppConfig = body

          if (!apiKey || !apiUrl || !sender) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Store config securely in user metadata or profiles table
          const { error } = await supabaseClient
            .from('profiles')
            .update({
              // Note: In production, you might want to encrypt these values
              // For now, we'll store them as JSON in a secure field
              whatsapp_config: JSON.stringify({ apiKey, apiUrl, sender })
            })
            .eq('user_id', user.id)

          if (error) {
            console.error('Error saving config:', error)
            return new Response(
              JSON.stringify({ error: 'Failed to save configuration' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        case 'test-connection': {
          const { to, message }: WhatsAppTestRequest = body
          
          // Get stored config
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('whatsapp_config')
            .eq('user_id', user.id)
            .single()

          if (!profile?.whatsapp_config) {
            return new Response(
              JSON.stringify({ error: 'WhatsApp not configured' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const config: WhatsAppConfig = JSON.parse(profile.whatsapp_config)
          
          // Test the WhatsApp API
          const success = await testWhatsAppAPI(config, to, message)

          return new Response(
            JSON.stringify({ success }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
      }
    }

    if (req.method === 'GET' && action === 'get-config') {
      // Get stored config (without exposing sensitive data)
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('whatsapp_config')
        .eq('user_id', user.id)
        .single()

      if (!profile?.whatsapp_config) {
        return new Response(
          JSON.stringify({ configured: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const config: WhatsAppConfig = JSON.parse(profile.whatsapp_config)
      
      return new Response(
        JSON.stringify({
          configured: true,
          apiUrl: config.apiUrl,
          sender: config.sender,
          // Don't expose the API key
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function testWhatsAppAPI(config: WhatsAppConfig, to: string, message: string): Promise<boolean> {
  try {
    const cleanNumber = to.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('62') ? cleanNumber : `62${cleanNumber}`;

    let url = config.apiUrl;
    let requestData: any;
    let headers: Record<string, string> = {};
    let method = 'POST';

    // Handle different API formats (same logic as client-side)
    if (config.apiUrl.includes('zapin.my.id')) {
      url = `${config.apiUrl}/messages`;
      requestData = {
        api_key: config.apiKey,
        sender: config.sender,
        number: formattedNumber,
        message: message
      };
      headers = { 'Content-Type': 'application/json' };
    } else if (config.apiUrl.includes('?')) {
      url = `${config.apiUrl}?api_key=${config.apiKey}&sender=${config.sender}&number=${formattedNumber}&message=${encodeURIComponent(message)}`;
      method = 'GET';
      requestData = null;
    } else {
      url = `${config.apiUrl}/messages`;
      requestData = {
        number: formattedNumber,
        message: message,
        sender: config.sender
      };
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };
    }

    const requestOptions: RequestInit = { method };
    if (method === 'POST' && requestData) {
      requestOptions.body = JSON.stringify(requestData);
      requestOptions.headers = headers;
    }

    const response = await fetch(url, requestOptions);
    return response.ok;

  } catch (error) {
    console.error('WhatsApp test failed:', error);
    return false;
  }
}