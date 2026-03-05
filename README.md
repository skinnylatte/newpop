### Hello

This is the codebase for Popagandhi.com, Adrianna Tan's blog since 2003. 2004? 

### Tech stack

- this blog runs on 11ty
- the site is served by netlify

How it works: everything in `src` is built by netlify and outputs into `_site`.

This is defined in `.eleventy.js`.

### Commands

- `npm run lint` - runs front matter and design-system checks
- `npm run build` - builds the site and minifies CSS
- `npm run start` - local development server

### Design system

See `docs/design-system.md` for layout contracts, token usage, and safe refactor order.
