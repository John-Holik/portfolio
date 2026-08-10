# johnholik.com

Personal portfolio site. Astro 5, no UI framework, deployed on Cloudflare Pages.

Live: **https://johnholik.com**

## Structure

```
src/data/site.ts        site-wide copy and links
src/data/projects.ts    project entries rendered by ProjectCard
src/layouts/Base.astro  shared shell
src/pages/index.astro   single-page layout
public/vcc-demo/        static demo of Vault Command Center
```

## Develop

```bash
nvm use          # see .nvmrc
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

Content lives in `src/data/*.ts`, so adding a project is a data edit, not a template change.
