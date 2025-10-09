# API HTTP

Base URL: `/`

## Health
- GET `/health`
  - 200 OK
  - Exemplo:
    ```bash
    curl -s http://localhost:3000/health
    ```

## Characters
Base path: `/api/characters`

- GET `/`
  - Retorna todos os personagens
  - 200 OK -> `Character[]`

- GET `/:id`
  - Retorna um personagem pelo id
  - 200 OK -> `Character`
  - 404 -> { message }

- POST `/`
  - Cria um personagem
  - 201 Created -> `Character`
  - 400 -> { message }

- PUT `/:id`
  - Atualiza um personagem
  - 200 OK -> `Character`
  - 400/404 -> { message }

- DELETE `/:id`
  - Remove um personagem
  - 204 No Content

## Sessions
Base path: `/api/sessions`

- GET `/`
  - Retorna todas as sessões
  - 200 OK -> `Session[]`

- GET `/search?term=...`
  - Pesquisa por termo
  - 200 OK -> `Session[]`
  - 400 -> { message }

- GET `/tags?tags=tag1&tags=tag2`
  - Filtra por tags
  - 200 OK -> `Session[]`

- GET `/:id`
  - Retorna sessão por id
  - 200 OK -> `Session`
  - 404 -> { message }

- POST `/`
  - Cria uma sessão
  - 201 Created -> `Session`
  - 400 -> { message, details }

- PUT `/:id`
  - Atualiza sessão
  - 200 OK -> `Session`
  - 400/404 -> { message }

- DELETE `/:id`
  - Remove sessão
  - 204 No Content

## Debug
Base path: `/debug`

- GET `/database`
  - Informa status do banco e amostras
  - 200 OK -> { connectionState, dbName, collections, sessionCount, sampleSessions, indexes }
