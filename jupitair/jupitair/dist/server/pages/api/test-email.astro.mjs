export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const zohoEmail = "contact@jupitairhvac.com";
  return new Response(JSON.stringify({
    zohoEmailSet: true,
    zohoPasswordSet: true,
    zohoEmailLength: zohoEmail?.length || 0,
    message: "Credentials are configured"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
