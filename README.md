# Agenda Estética

PWA para agenda de uma profissional de estética.

## Stack

- React + TypeScript + Vite
- PWA (vite-plugin-pwa)
- TailwindCSS
- React Router
- React Hook Form + Zod
- Dexie (IndexedDB)
- React Query
- Framer Motion
- Lucide Icons

## Scripts

```bash
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção (typecheck + vite build)
npm run preview   # preview do build
npm run lint       # eslint
npm run format     # prettier --write
```

## Arquitetura

```
src/
  components/   # componentes de UI e layout reutilizáveis
  features/     # regras de negócio por domínio
  services/     # integrações e regras de aplicação
  repositories/ # acesso a dados (Dexie/IndexedDB)
  hooks/        # hooks reutilizáveis
  pages/        # páginas roteadas
  layouts/      # layouts (root, app shell)
  types/        # tipos compartilhados
  utils/        # utilitários
```
