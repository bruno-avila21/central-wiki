import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://bruno-avila21.github.io',
  base: '/central-wiki',
  integrations: [
    starlight({
      title: 'Bruno Avila — Dev Wiki',
      description: 'Stack, arquitectura y guías de cada proyecto — sincronizados automáticamente desde GitHub.',
      customCss: ['./src/styles/custom.css'],
      head: [
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:title', content: 'Bruno Avila — Dev Wiki' } },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Stack, arquitectura y guías de cada proyecto — sincronizados automáticamente desde GitHub.' } },
        { tag: 'meta', attrs: { property: 'og:url', content: 'https://bruno-avila21.github.io/central-wiki/' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'Bruno Avila — Dev Wiki' } },
        { tag: 'meta', attrs: { name: 'twitter:description', content: 'Stack, arquitectura y guías de cada proyecto — sincronizados automáticamente desde GitHub.' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bruno-avila21' },
      ],
      sidebar: [
        { label: 'Inicio', link: '/' },
        { label: 'Qué hay de nuevo', link: '/novedades' },
        {
          label: 'Frontend',
          autogenerate: { directory: 'frontend' },
        },
        {
          label: 'Backend',
          autogenerate: { directory: 'backend' },
        },
        {
          label: 'Agentes',
          autogenerate: { directory: 'agentes' },
        },
        {
          label: 'Infraestructura',
          autogenerate: { directory: 'infraestructura' },
        },
      ],
    }),
  ],
});
