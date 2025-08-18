import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const zohoEmail = import.meta.env.ZOHO_EMAIL;
  const zohoPassword = import.meta.env.ZOHO_PASSWORD;
  
  return new Response(JSON.stringify({
    zohoEmailSet: !!zohoEmail,
    zohoPasswordSet: !!zohoPassword,
    zohoEmailLength: zohoEmail?.length || 0,
    message: (!zohoEmail || !zohoPassword) 
      ? 'Please add ZOHO_EMAIL and ZOHO_PASSWORD to your .env file' 
      : 'Credentials are configured'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};