# Web (Express)

## App
- Função pública: `createApp(): Express`
  - Registra middlewares (`cors`, `helmet`, `express.json`) e rotas:
    - `/api/characters` → `characterRoutes`
    - `/api/sessions` → `sessionRoutes`
    - `/debug` → `debugRoutes`
  - Endpoint de health: `GET /health`
  - Middleware de erros: `errorHandler`

## Rotas
- `infrastructure/web/routes/characterRoutes.ts`
- `infrastructure/web/routes/sessionRoutes.ts`
- `infrastructure/web/routes/debugRoutes.ts`

## Controladores
- `CharacterController`
  - `getAllCharacters(req, res): Promise<Response>`
  - `getCharacterById(req, res): Promise<Response>`
  - `createCharacter(req, res): Promise<Response>`
  - `updateCharacter(req, res): Promise<Response>`
  - `deleteCharacter(req, res): Promise<Response>`

- `SessionController`
  - `getAllSessions(req, res): Promise<Response>`
  - `getSessionById(req, res): Promise<Response>`
  - `getSessionsByTags(req, res): Promise<Response>`
  - `searchSessions(req, res): Promise<Response>`
  - `createSession(req, res): Promise<Response>`
  - `updateSession(req, res): Promise<Response>`
  - `deleteSession(req, res): Promise<Response>`

- `DebugController`
  - `getDatabaseInfo(req, res): Promise<Response>`

## Middleware
- `errorHandler(err, req, res, next)`
  - Trata `ApplicationError` com `statusCode`
  - Responde 500 para erros não tratados
