# Ketli Time

Six botanical tea blends with photographic kettle packaging, informational galleries, favourites, a tea finder and brewing timer. Phones use an edge-to-edge, full-height three-kettle portrait photograph with the introduction on its olive wall, followed by the complete six-tea collection; the laptop hero retains its panoramic photograph. Product galleries support swipe, zoom and readable, horizontally scrolling thumbnails. Brewing details expand on demand. Checkout displays a restocking notice. Notification sign-ups are coming soon; no payment, real order or email collection is enabled.

This is an academic marketing prototype. Prices, recipes and packaging are concepts.

## Run

Use Node.js 24.14 or later: `npm ci`, then `npm run dev`. Verify with `npm test` and `npm run build`. Browser checks: `npm run test:browser` and `npm run test:motion` (installed Google Chrome required).

## Netlify

Import this GitHub repository. Build command: `npm run build`. Publish directory: `dist`. Node.js 24 is configured in `netlify.toml`. No secrets or application server are required.

After GitHub continuous deployment is connected, pushes to the production branch automatically build and update the same site URL. Local edits alone do not change the live site. For manual deployment, build locally and upload `dist`, including `_headers`.

## Source

`src/ketli-catalog.js` contains product content. Homepage, product and restock page scripts are in `src/`. All website media and downloadable information panels are local in `public/`. The original packaging exports, archived charm project, private notes and local databases are not included.
