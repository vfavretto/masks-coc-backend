---
description: Como fazer deploy do backend para Render
---

# Deploy do Backend para Render

## Configuração Inicial

O backend está configurado para deploy automático no Render quando há push na branch `main`.

## Deploy Manual

// turbo

1. Build do TypeScript:

```bash
npm run build
```

// turbo 2. Verificar se build está ok:

```bash
npm run start
```

3. Push para main:

```bash
git push origin main
```

4. O Render detectará automaticamente e fará o deploy.

## Verificação

// turbo

1. Verificar health check:

```bash
curl https://masks-coc-backend.onrender.com/health
```

Resposta esperada:

```json
{ "status": "ok", "timestamp": "2024-..." }
```

## Variáveis de Ambiente no Render

Configurar no dashboard do Render:

- `MONGODB_URI` - Connection string do MongoDB Atlas
- `FRONTEND_URL` - URL do frontend (https://vfavretto.github.io/masks-coc)
- `PORT` - 3000 (ou deixar Render configurar)

## Troubleshooting

### Cold Start

O plano gratuito do Render desliga após 15min de inatividade. A primeira requisição pode demorar até 30s. O frontend já tem retry automático configurado.

### Erro de CORS

Verificar o array `allowedOrigins` em `infrastructure/web/app.ts`.
