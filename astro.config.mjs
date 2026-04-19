import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://bruno-avila21.github.io',
  base: '/central-wiki',
  integrations: [
    starlight({
      title: 'Bruno Avila — Dev Wiki',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bruno-avila21' },
      ],
      sidebar: [
        { label: 'Inicio', link: '/' },
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
