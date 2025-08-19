import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    console.log('Test form received:', data);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Test form works!',
      received: data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Test form error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Test form failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};