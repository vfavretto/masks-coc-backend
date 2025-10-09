# Casos de Uso

## Characters
- `GetAllCharactersUseCase.execute(): Promise<Character[]>`
- `GetCharacterByIdUseCase.execute(id): Promise<Character>`
- `CreateCharacterUseCase.execute(data): Promise<Character>`
- `UpdateCharacterUseCase.execute(id, data): Promise<Character>`
- `DeleteCharacterUseCase.execute(id): Promise<void>`

## Sessions
- `GetAllSessions.execute(): Promise<Session[]>`
- `GetSessionById.execute(id): Promise<Session>`
- `FilterSessionsByTag.execute(tags: string[]): Promise<Session[]>`
- `SearchSession.execute(term: string): Promise<Session[]>`
- `CreateSessionUseCase.execute(data): Promise<Session>`
- `UpdateSessionUseCase.execute(id, data): Promise<Session>`
- `DeleteSessionUseCase.execute(id): Promise<void>`
