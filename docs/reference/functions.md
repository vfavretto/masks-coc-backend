# Funções, Classes e Módulos Públicos

## Conexão com Banco (`infrastructure/database/config.ts`)
- `connectDatabase(): Promise<void>`
- `disconnectDatabase(): Promise<void>`

## App Web (`infrastructure/web/app.ts`)
- `createApp(): Express`

## Repositórios (interfaces)
- `domain/repositories/CharacterRepository`
  - `findAll(): Promise<Character[]>`
  - `findById(id: string): Promise<Character | null>`
  - `create(data): Promise<Character>`
  - `update(id, data): Promise<Character | null>`
  - `delete(id): Promise<boolean>`
- `domain/repositories/SessionRepository`
  - `findAll(): Promise<Session[]>`
  - `findById(id: string): Promise<Session | null>`
  - `findByTags(tags: string[]): Promise<Session[]>`
  - `search(term: string): Promise<Session[]>`
  - `create(data): Promise<Session>`
  - `update(id, data): Promise<Session | null>`
  - `delete(id): Promise<boolean>`

## Repositórios (implementações Mongo)
- `MongoCharacterRepository`
  - Implementa `CharacterRepository`
- `MongoSessionRepository`
  - Implementa `SessionRepository`

## Casos de Uso (Application)
- Characters
  - `GetAllCharactersUseCase.execute()`
  - `GetCharacterByIdUseCase.execute(id)`
  - `CreateCharacterUseCase.execute(data)`
  - `UpdateCharacterUseCase.execute(id, data)`
  - `DeleteCharacterUseCase.execute(id)`
- Sessions
  - `GetAllSessions.execute()`
  - `GetSessionById.execute(id)`
  - `FilterSessionsByTag.execute(tags)`
  - `SearchSession.execute(term)`
  - `CreateSessionUseCase.execute(data)`
  - `UpdateSessionUseCase.execute(id, data)`
  - `DeleteSessionUseCase.execute(id)`

## Controladores (Express)
- `CharacterController`
- `SessionController`
- `DebugController`

## Validadores
- `validateCreateCharacter(data)`
- `validateUpdateCharacter(data)`
- `validateCreateSession(data)`
- `validateUpdateSession(data)`

## Erros
- `ApplicationError`
- `NotFoundError`
- `ValidationError`
