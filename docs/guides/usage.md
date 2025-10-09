# Guia de Uso

## Iniciar o servidor
```bash
npm install
npm run build
npm start
```

## Testar health check
```bash
curl -s http://localhost:3000/health | jq
```

## Exemplos de requisições

### Characters
- Listar todos
```bash
curl -s http://localhost:3000/api/characters | jq
```
- Criar
```bash
curl -s -X POST http://localhost:3000/api/characters \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"John Doe",
    "occupation":"Investigator",
    "image":"https://example.com/john.png",
    "stats": {"For":50,"Con":50,"Tam":50,"Des":50,"Apa":50,"Edu":50,"Int":50,"Pod":50},
    "background":"...",
    "mentalHealth": {"sanity":50,"maxSanity":50,"tempSanity":false,"indefiniteSanity":false,"phobias":[],"manias":[]},
    "skills":[],
    "equipment":[],
    "pulpTalents":[],
    "wounds":0,
    "maxHealth":12
  }' | jq
```

### Sessions
- Pesquisar por termo
```bash
curl -s 'http://localhost:3000/api/sessions/search?term=arkham' | jq
```
- Filtrar por tags
```bash
curl -s 'http://localhost:3000/api/sessions/tags?tags=horror&tags=arkham' | jq
```
- Criar sessão
```bash
curl -s -X POST http://localhost:3000/api/sessions \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Capítulo 1",
    "date":"2024-10-01T00:00:00.000Z",
    "location":"Arkham",
    "summary":"Resumo",
    "details":"Detalhes",
    "tags":["horror"],
    "images":[],
    "clues":[],
    "items":[]
  }' | jq
```
