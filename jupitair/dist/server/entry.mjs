import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BFsfdKIQ.mjs';
import { manifest } from './manifest_BU_zBebr.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/allen/ac-repair.astro.mjs');
const _page4 = () => import('./pages/api/availability.astro.mjs');
const _page5 = () => import('./pages/api/contact.astro.mjs');
const _page6 = () => import('./pages/api/reviews-aggregator.astro.mjs');
const _page7 = () => import('./pages/api/test-email.astro.mjs');
const _page8 = () => import('./pages/blog.astro.mjs');
const _page9 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page10 = () => import('./pages/cloudinary-demo.astro.mjs');
const _page11 = () => import('./pages/cloudinary-test.astro.mjs');
const _page12 = () => import('./pages/commercial/chiller-systems.astro.mjs');
const _page13 = () => import('./pages/commercial/emergency-service.astro.mjs');
const _page14 = () => import('./pages/commercial/new-installation.astro.mjs');
const _page15 = () => import('./pages/commercial/office-hvac.astro.mjs');
const _page16 = () => import('./pages/commercial/preventive-maintenance.astro.mjs');
const _page17 = () => import('./pages/commercial/restaurant-hvac.astro.mjs');
const _page18 = () => import('./pages/commercial/retail-hvac.astro.mjs');
const _page19 = () => import('./pages/commercial/rtu-replacement.astro.mjs');
const _page20 = () => import('./pages/commercial.astro.mjs');
const _page21 = () => import('./pages/contact.astro.mjs');
const _page22 = () => import('./pages/frisco/ac-repair.astro.mjs');
const _page23 = () => import('./pages/mckinney/ac-repair.astro.mjs');
const _page24 = () => import('./pages/oauth/callback.astro.mjs');
const _page25 = () => import('./pages/oauth/setup.astro.mjs');
const _page26 = () => import('./pages/oauth/simple-setup.astro.mjs');
const _page27 = () => import('./pages/plano/ac-repair.astro.mjs');
const _page28 = () => import('./pages/privacy.astro.mjs');
const _page29 = () => import('./pages/robots.txt.astro.mjs');
const _page30 = () => import('./pages/schedule.astro.mjs');
const _page31 = () => import('./pages/services/residential.astro.mjs');
const _page32 = () => import('./pages/services/_service_.astro.mjs');
const _page33 = () => import('./pages/services.astro.mjs');
const _page34 = () => import('./pages/services/_---slug_.astro.mjs');
const _page35 = () => import('./pages/sitemap.astro.mjs');
const _page36 = () => import('./pages/sitemap.xml.astro.mjs');
const _page37 = () => import('./pages/style-guide.astro.mjs');
const _page38 = () => import('./pages/success.astro.mjs');
const _page39 = () => import('./pages/terms.astro.mjs');
const _page40 = () => import('./pages/_city_/_service_.astro.mjs');
const _page41 = () => import('./pages/_city_.astro.mjs');
const _page42 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/allen/ac-repair.astro", _page3],
    ["src/pages/api/availability.ts", _page4],
    ["src/pages/api/contact.ts", _page5],
    ["src/pages/api/reviews-aggregator.ts", _page6],
    ["src/pages/api/test-email.ts", _page7],
    ["src/pages/blog/index.astro", _page8],
    ["src/pages/blog/[...slug].astro", _page9],
    ["src/pages/cloudinary-demo.astro", _page10],
    ["src/pages/cloudinary-test.astro", _page11],
    ["src/pages/commercial/chiller-systems.astro", _page12],
    ["src/pages/commercial/emergency-service.astro", _page13],
    ["src/pages/commercial/new-installation.astro", _page14],
    ["src/pages/commercial/office-hvac.astro", _page15],
    ["src/pages/commercial/preventive-maintenance.astro", _page16],
    ["src/pages/commercial/restaurant-hvac.astro", _page17],
    ["src/pages/commercial/retail-hvac.astro", _page18],
    ["src/pages/commercial/rtu-replacement.astro", _page19],
    ["src/pages/commercial.astro", _page20],
    ["src/pages/contact.astro", _page21],
    ["src/pages/frisco/ac-repair.astro", _page22],
    ["src/pages/mckinney/ac-repair.astro", _page23],
    ["src/pages/oauth/callback.astro", _page24],
    ["src/pages/oauth/setup.astro", _page25],
    ["src/pages/oauth/simple-setup.html", _page26],
    ["src/pages/plano/ac-repair.astro", _page27],
    ["src/pages/privacy.astro", _page28],
    ["src/pages/robots.txt.ts", _page29],
    ["src/pages/schedule.astro", _page30],
    ["src/pages/services/residential.astro", _page31],
    ["src/pages/services/[service].astro", _page32],
    ["src/pages/services.astro", _page33],
    ["src/pages/services/[...slug].astro", _page34],
    ["src/pages/sitemap.astro", _page35],
    ["src/pages/sitemap.xml.ts", _page36],
    ["src/pages/style-guide.astro", _page37],
    ["src/pages/success.astro", _page38],
    ["src/pages/terms.astro", _page39],
    ["src/pages/[city]/[service].astro", _page40],
    ["src/pages/[city].astro", _page41],
    ["src/pages/index.astro", _page42]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///Users/mbp-ez/Desktop/AI%20Library/Apps/jupitair/jupitair/jupitair/dist/client/",
    "server": "file:///Users/mbp-ez/Desktop/AI%20Library/Apps/jupitair/jupitair/jupitair/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "assets"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
