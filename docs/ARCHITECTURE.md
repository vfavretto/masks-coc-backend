# Guia de Arquitetura

## Índice

- [Visão Geral](#visão-geral)
- [Clean Architecture](#clean-architecture)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Fluxo de Dados](#fluxo-de-dados)
- [Princípios SOLID](#princípios-solid)
- [Padrões de Projeto](#padrões-de-projeto)
- [Detalhamento das Camadas](#detalhamento-das-camadas)
- [Inversão de Dependência](#inversão-de-dependência)
- [Testabilidade](#testabilidade)
- [Expansão e Manutenção](#expansão-e-manutenção)

---

## Visão Geral

Este projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), proposta por Robert C. Martin (Uncle Bob). O objetivo é criar um sistema:

- ✅ **Independente de frameworks** - A lógica de negócio não depende de Express, MongoDB, etc.
- ✅ **Testável** - Regras de negócio podem ser testadas sem UI, BD ou serviços externos
- ✅ **Independente de UI** - A UI pode mudar sem afetar o resto do sistema
- ✅ **Independente de banco de dados** - Pode-se trocar MongoDB por PostgreSQL sem afetar regras de negócio
- ✅ **Independente de agentes externos** - Regras de negócio não sabem nada sobre o mundo externo

## Clean Architecture

### Diagrama Conceitual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │          INFRASTRUCTURE LAYER                     │     │
│  │  (Frameworks, Drivers, External Interfaces)       │     │
│  │  - Express Routes & Controllers                   │     │
│  │  - MongoDB Models & Repositories                  │     │
│  │  - HTTP Middlewares                               │     │
│  │  - Validators (Joi)                               │     │
│  └───────────────────────────────────────────────────┘     │
│                        ↓ ↑                                  │
│  ┌───────────────────────────────────────────────────┐     │
│  │         APPLICATION LAYER                         │     │
│  │  (Use Cases / Interactors)                        │     │
│  │  - GetAllCharacters                               │     │
│  │  - CreateSession                                  │     │
│  │  - UpdateCharacter                                │     │
│  │  - DeleteSession                                  │     │
│  └───────────────────────────────────────────────────┘     │
│                        ↓ ↑                                  │
│  ┌───────────────────────────────────────────────────┐     │
│  │            DOMAIN LAYER                           │     │
│  │  (Business Rules, Entities)                       │     │
│  │  - Character Entity                               │     │
│  │  - Session Entity                                 │     │
│  │  - Repository Interfaces                          │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

REGRA DE DEPENDÊNCIA:
Setas apontam para dentro → Camadas internas não conhecem as externas
```

### Regra de Dependência

**FUNDAMENTAL:** As dependências de código-fonte devem apontar apenas para dentro, em direção às políticas de nível superior.

- **Infrastructure** depende de **Application** e **Domain**
- **Application** depende apenas de **Domain**
- **Domain** não depende de nada (core puro)

---

## Estrutura de Camadas

### 1. Domain Layer (Domínio)

**Localização:** `domain/`

**Responsabilidade:** Contém as regras de negócio fundamentais da aplicação.

**Componentes:**
- **Entities** - Objetos de negócio (Character, Session)
- **Repository Interfaces** - Contratos para persistência de dados

**Características:**
- ✅ Não possui dependências externas
- ✅ TypeScript puro, sem frameworks
- ✅ Interfaces e tipos
- ✅ Representa o "coração" do sistema

**Exemplo:**

```typescript
// domain/entities/Character.ts
export interface Character {
  id: string;
  name: string;
  occupation: string;
  stats: Stats;
  // ... outros campos
}

// domain/repositories/CharacterRepository.ts
export interface CharacterRepository {
  findAll(): Promise<Character[]>;
  findById(id: string): Promise<Character | null>;
  create(character: CreateCharacterDTO): Promise<Character>;
  update(id: string, data: UpdateCharacterDTO): Promise<Character | null>;
  delete(id: string): Promise<boolean>;
}
```

### 2. Application Layer (Aplicação)

**Localização:** `application/`

**Responsabilidade:** Contém os casos de uso da aplicação - orquestra o fluxo de dados.

**Componentes:**
- **Use Cases** - Implementam ações específicas do sistema

**Características:**
- ✅ Depende apenas do Domain
- ✅ Não conhece detalhes de infraestrutura
- ✅ Recebe interfaces, não implementações concretas
- ✅ Coordena entidades e repositórios

**Exemplo:**

```typescript
// application/useCases/character/GetAllCharacters.ts
import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';

export class GetAllCharactersUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(): Promise<Character[]> {
    return this.characterRepository.findAll();
  }
}
```

**Casos de Uso Implementados:**

**Characters:**
- `GetAllCharactersUseCase` - Lista todos os personagens
- `GetCharacterByIdUseCase` - Busca personagem por ID
- `CreateCharacterUseCase` - Cria novo personagem
- `UpdateCharacterUseCase` - Atualiza personagem
- `DeleteCharacterUseCase` - Remove personagem

**Sessions:**
- `GetAllSessions` - Lista todas as sessões
- `GetSessionById` - Busca sessão por ID
- `FilterSessionsByTag` - Filtra por tags
- `SearchSession` - Busca por termo
- `CreateSessionUseCase` - Cria nova sessão
- `UpdateSessionUseCase` - Atualiza sessão
- `DeleteSessionUseCase` - Remove sessão

### 3. Infrastructure Layer (Infraestrutura)

**Localização:** `infrastructure/`

**Responsabilidade:** Detalhes de implementação - frameworks, banco de dados, web.

**Componentes:**

#### 3.1 Database (`infrastructure/database/`)

**Models:**
- `CharacterModel` - Schema Mongoose para Character
- `SessionModel` - Schema Mongoose para Session

**Repositories:**
- `MongoCharacterRepository` - Implementação concreta do CharacterRepository
- `MongoSessionRepository` - Implementação concreta do SessionRepository

**Config:**
- `config.ts` - Configuração de conexão MongoDB

**Exemplo:**

```typescript
// infrastructure/database/repositories/MongoCharacterRepository.ts
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';
import { CharacterModel } from '../models/CharacterModel';

export class MongoCharacterRepository implements CharacterRepository {
  async findAll(): Promise<Character[]> {
    const characters = await CharacterModel.find();
    return characters.map(this.documentToEntity);
  }
  
  async findById(id: string): Promise<Character | null> {
    const character = await CharacterModel.findById(id);
    return character ? this.documentToEntity(character) : null;
  }
  
  // ... outras implementações
  
  private documentToEntity(doc: CharacterDocument): Character {
    // Conversão de Mongoose Document para Domain Entity
    return {
      id: doc.id.toString(),
      name: doc.name,
      // ... outros campos
    };
  }
}
```

#### 3.2 Web (`infrastructure/web/`)

**Controllers:**
- `CharacterController` - Manipula requisições HTTP de personagens
- `SessionController` - Manipula requisições HTTP de sessões
- `DebugController` - Endpoints de debug/health check

**Routes:**
- `characterRoutes.ts` - Define rotas `/api/characters`
- `sessionRoutes.ts` - Define rotas `/api/sessions`
- `debugRoutes.ts` - Define rotas de debug

**Validators:**
- `characterValidator.ts` - Validação com Joi para Character
- `sessionValidator.ts` - Validação com Joi para Session

**Middlewares:**
- `errorHandler.ts` - Tratamento global de erros

**App:**
- `app.ts` - Configuração do Express

**Exemplo:**

```typescript
// infrastructure/web/controllers/CharacterController.ts
export class CharacterController {
  constructor(
    private readonly getAllCharactersUseCase: GetAllCharactersUseCase,
    private readonly getCharacterByIdUseCase: GetCharacterByIdUseCase,
    private readonly createCharacterUseCase: CreateCharacterUseCase,
    private readonly updateCharacterUseCase: UpdateCharacterUseCase,
    private readonly deleteCharacterUseCase: DeleteCharacterUseCase
  ) {}

  async getAllCharacters(req: Request, res: Response): Promise<Response> {
    try {
      const characters = await this.getAllCharactersUseCase.execute();
      return res.status(200).json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      return res.status(500).json({ message: "Error fetching characters" });
    }
  }
  
  // ... outros métodos
}
```

### 4. Shared Layer (Compartilhado)

**Localização:** `shared/`

**Responsabilidade:** Código compartilhado entre camadas.

**Componentes:**
- **Errors** - Classes de erro customizadas

**Exemplo:**

```typescript
// shared/errors/ApplicationError.ts
export class ApplicationError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// shared/errors/NotFoundError.ts
export class NotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} not found`, 404);
  }
}
```

---

## Fluxo de Dados

### Request → Response Flow

```
┌──────────────┐
│   CLIENT     │
│  (Browser)   │
└──────┬───────┘
       │ HTTP Request
       ↓
┌──────────────────────────────────────────┐
│  INFRASTRUCTURE - Web                    │
│  ┌────────────┐                          │
│  │   Routes   │ → Mapeia URL para        │
│  └─────┬──────┘   Controller             │
│        ↓                                  │
│  ┌────────────┐                          │
│  │ Validators │ → Valida entrada         │
│  └─────┬──────┘   (Joi)                  │
│        ↓                                  │
│  ┌────────────┐                          │
│  │Controller  │ → Orquestra requisição   │
│  └─────┬──────┘                          │
└────────┼──────────────────────────────────┘
         │ Chama Use Case
         ↓
┌──────────────────────────────────────────┐
│  APPLICATION - Use Cases                 │
│  ┌────────────┐                          │
│  │  Use Case  │ → Executa lógica de      │
│  └─────┬──────┘   negócio                │
└────────┼──────────────────────────────────┘
         │ Usa Repository Interface
         ↓
┌──────────────────────────────────────────┐
│  DOMAIN - Repositories (Interface)       │
│  Define contrato                         │
└────────┬──────────────────────────────────┘
         │ Implementado por
         ↓
┌──────────────────────────────────────────┐
│  INFRASTRUCTURE - Database               │
│  ┌────────────┐                          │
│  │ Repository │ → Implementa interface   │
│  │Implementation│  usando Mongoose       │
│  └─────┬──────┘                          │
│        ↓                                  │
│  ┌────────────┐                          │
│  │   Model    │ → Acessa MongoDB         │
│  └─────┬──────┘                          │
└────────┼──────────────────────────────────┘
         │ Dados
         ↓
    ┌─────────┐
    │ MongoDB │
    └─────────┘
```

### Exemplo Prático: Criar Personagem

**1. Cliente faz requisição:**
```javascript
POST /api/characters
{
  "name": "Dr. Armitage",
  "occupation": "Professor",
  // ... dados
}
```

**2. Route captura:**
```typescript
// infrastructure/web/routes/characterRoutes.ts
router.post('/', async (req, res) => {
  await characterController.createCharacter(req, res);
});
```

**3. Validator valida:**
```typescript
// infrastructure/web/validators/characterValidator.ts
const { error, value } = validateCreateCharacter(req.body);
if (error) {
  return res.status(400).json({ message: error.message });
}
```

**4. Controller orquestra:**
```typescript
// infrastructure/web/controllers/CharacterController.ts
const character = await this.createCharacterUseCase.execute(value);
return res.status(201).json(character);
```

**5. Use Case executa:**
```typescript
// application/useCases/character/CreateCharacter.ts
async execute(data: CreateCharacterDTO): Promise<Character> {
  return this.characterRepository.create(data);
}
```

**6. Repository implementa:**
```typescript
// infrastructure/database/repositories/MongoCharacterRepository.ts
async create(data: CreateCharacterDTO): Promise<Character> {
  const newCharacter = await CharacterModel.create(data);
  return this.documentToEntity(newCharacter);
}
```

**7. Resposta retorna ao cliente**

---

## Princípios SOLID

### S - Single Responsibility Principle (Princípio da Responsabilidade Única)

Cada classe tem uma única razão para mudar.

**Exemplo:**
- `CreateCharacterUseCase` - Responsável APENAS por criar personagens
- `CharacterController` - Responsável APENAS por lidar com HTTP
- `MongoCharacterRepository` - Responsável APENAS por persistência MongoDB

### O - Open/Closed Principle (Princípio Aberto/Fechado)

Aberto para extensão, fechado para modificação.

**Exemplo:**
```typescript
// Adicionar novo repositório sem modificar código existente
export class PostgresCharacterRepository implements CharacterRepository {
  // Nova implementação
}

// Trocar implementação na configuração
const repository = new PostgresCharacterRepository(); // em vez de Mongo
```

### L - Liskov Substitution Principle (Princípio da Substituição de Liskov)

Subtipos devem ser substituíveis por seus tipos base.

**Exemplo:**
```typescript
// Qualquer implementação de CharacterRepository pode ser usada
const useCase = new GetAllCharactersUseCase(repository);
// repository pode ser MongoCharacterRepository, PostgresRepository, etc.
```

### I - Interface Segregation Principle (Princípio da Segregação de Interface)

Clientes não devem depender de interfaces que não usam.

**Exemplo:**
```typescript
// Interfaces específicas em vez de uma genérica
interface CharacterRepository { /* métodos de Character */ }
interface SessionRepository { /* métodos de Session */ }

// Não uma interface genérica Repository com todos os métodos
```

### D - Dependency Inversion Principle (Princípio da Inversão de Dependência)

Dependa de abstrações, não de implementações concretas.

**Exemplo:**
```typescript
// Use Case depende da interface (abstração)
export class CreateCharacterUseCase {
  constructor(private repository: CharacterRepository) {} // interface
}

// Injeção de dependência na camada de infraestrutura
const repository = new MongoCharacterRepository(); // implementação
const useCase = new CreateCharacterUseCase(repository);
```

---

## Padrões de Projeto

### 1. Repository Pattern

Abstrai a camada de persistência.

**Benefícios:**
- Troca de banco de dados sem afetar lógica de negócio
- Facilita testes (mocks)
- Centraliza lógica de acesso a dados

**Implementação:**
```typescript
// Interface (Domain)
interface CharacterRepository {
  findAll(): Promise<Character[]>;
}

// Implementação Mongo (Infrastructure)
class MongoCharacterRepository implements CharacterRepository {
  async findAll(): Promise<Character[]> {
    return CharacterModel.find();
  }
}

// Implementação em Memória (Testes)
class InMemoryCharacterRepository implements CharacterRepository {
  private characters: Character[] = [];
  
  async findAll(): Promise<Character[]> {
    return this.characters;
  }
}
```

### 2. Dependency Injection

Injeta dependências em vez de criar internamente.

**Exemplo:**
```typescript
// ❌ Ruim - cria dependência internamente
class CreateCharacterUseCase {
  async execute(data: any) {
    const repository = new MongoCharacterRepository(); // acoplado
    return repository.create(data);
  }
}

// ✅ Bom - recebe dependência
class CreateCharacterUseCase {
  constructor(private repository: CharacterRepository) {} // injetado
  
  async execute(data: any) {
    return this.repository.create(data);
  }
}

// Configuração (Composition Root)
const repository = new MongoCharacterRepository();
const useCase = new CreateCharacterUseCase(repository);
```

### 3. Use Case Pattern

Encapsula lógica de negócio em casos de uso específicos.

**Estrutura:**
```typescript
export class [Action][Entity]UseCase {
  constructor(private repository: Repository) {}
  
  async execute(params): Promise<Result> {
    // 1. Validar
    // 2. Executar lógica de negócio
    // 3. Persistir se necessário
    // 4. Retornar resultado
  }
}
```

### 4. DTO (Data Transfer Object)

Objetos para transferência de dados entre camadas.

**Exemplo:**
```typescript
type CreateCharacterDTO = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateCharacterDTO = Partial<CreateCharacterDTO>;

// Uso no Use Case
async execute(data: CreateCharacterDTO): Promise<Character> {
  return this.repository.create(data);
}
```

---

## Inversão de Dependência

### Diagrama de Dependências

```
┌─────────────────────────────────────────────┐
│     MongoCharacterRepository                │
│  (Infrastructure - Implementação)           │
└───────────────┬─────────────────────────────┘
                │ implements
                ↓
┌─────────────────────────────────────────────┐
│     CharacterRepository                     │
│  (Domain - Interface)                       │
└───────────────△─────────────────────────────┘
                │ depends on
                │
┌───────────────┴─────────────────────────────┐
│     CreateCharacterUseCase                  │
│  (Application)                              │
└─────────────────────────────────────────────┘

Application depende de Interface (Domain)
Infrastructure implementa Interface (Domain)
```

### Benefícios

1. **Testabilidade**
```typescript
// Mock para testes
class MockCharacterRepository implements CharacterRepository {
  async create(data: any) {
    return { id: '123', ...data } as Character;
  }
  // ... outros métodos
}

// Teste
const mockRepo = new MockCharacterRepository();
const useCase = new CreateCharacterUseCase(mockRepo);
const result = await useCase.execute(testData);
```

2. **Flexibilidade**
```typescript
// Trocar implementação facilmente
const prodRepo = new MongoCharacterRepository();
const devRepo = new InMemoryCharacterRepository();
const testRepo = new MockCharacterRepository();

const useCase = new CreateCharacterUseCase(
  env === 'prod' ? prodRepo : devRepo
);
```

---

## Testabilidade

### Estrutura de Testes

```
tests/
├── unit/
│   ├── domain/
│   ├── application/
│   │   ├── character/
│   │   │   ├── CreateCharacter.test.ts
│   │   │   └── GetAllCharacters.test.ts
│   │   └── session/
│   └── infrastructure/
├── integration/
│   ├── api/
│   │   ├── character.test.ts
│   │   └── session.test.ts
│   └── database/
└── e2e/
    └── flows.test.ts
```

### Exemplo de Teste Unitário

```typescript
// tests/unit/application/character/CreateCharacter.test.ts
describe('CreateCharacterUseCase', () => {
  it('should create a character', async () => {
    // Arrange
    const mockRepo: CharacterRepository = {
      create: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test',
        // ... dados
      }),
      // ... outros métodos
    };
    
    const useCase = new CreateCharacterUseCase(mockRepo);
    const data = { name: 'Test', /* ... */ };
    
    // Act
    const result = await useCase.execute(data);
    
    // Assert
    expect(result.id).toBe('1');
    expect(mockRepo.create).toHaveBeenCalledWith(data);
  });
});
```

### Exemplo de Teste de Integração

```typescript
// tests/integration/api/character.test.ts
describe('Character API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  
  afterAll(async () => {
    await disconnectDatabase();
  });
  
  it('POST /api/characters should create character', async () => {
    const response = await request(app)
      .post('/api/characters')
      .send({ name: 'Test', /* ... */ });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

---

## Expansão e Manutenção

### Adicionar Novo Recurso (Feature)

**Exemplo: Adicionar "Campanhas"**

**1. Criar entidade no Domain:**
```typescript
// domain/entities/Campaign.ts
export interface Campaign {
  id: string;
  name: string;
  description: string;
  sessions: string[]; // IDs de sessões
}
```

**2. Criar repository interface:**
```typescript
// domain/repositories/CampaignRepository.ts
export interface CampaignRepository {
  findAll(): Promise<Campaign[]>;
  findById(id: string): Promise<Campaign | null>;
  create(data: CreateCampaignDTO): Promise<Campaign>;
  // ...
}
```

**3. Criar Use Cases:**
```typescript
// application/useCases/campaign/CreateCampaign.ts
export class CreateCampaignUseCase {
  constructor(private repository: CampaignRepository) {}
  
  async execute(data: CreateCampaignDTO): Promise<Campaign> {
    return this.repository.create(data);
  }
}
```

**4. Implementar Repository:**
```typescript
// infrastructure/database/models/CampaignModel.ts
const CampaignSchema = new Schema({
  name: String,
  description: String,
  sessions: [String],
});

export const CampaignModel = model('Campaign', CampaignSchema);

// infrastructure/database/repositories/MongoCampaignRepository.ts
export class MongoCampaignRepository implements CampaignRepository {
  async create(data: CreateCampaignDTO): Promise<Campaign> {
    const campaign = await CampaignModel.create(data);
    return this.documentToEntity(campaign);
  }
  // ...
}
```

**5. Criar Controller e Routes:**
```typescript
// infrastructure/web/controllers/CampaignController.ts
export class CampaignController {
  constructor(
    private createUseCase: CreateCampaignUseCase,
    // ... outros
  ) {}
  
  async create(req: Request, res: Response) {
    const campaign = await this.createUseCase.execute(req.body);
    return res.status(201).json(campaign);
  }
}

// infrastructure/web/routes/campaignRoutes.ts
const router = Router();
const repository = new MongoCampaignRepository();
const createUseCase = new CreateCampaignUseCase(repository);
const controller = new CampaignController(createUseCase);

router.post('/', (req, res) => controller.create(req, res));

export { router as campaignRoutes };
```

### Trocar Banco de Dados

**De MongoDB para PostgreSQL:**

**1. Instalar dependências:**
```bash
npm install pg typeorm
```

**2. Criar nova implementação:**
```typescript
// infrastructure/database/repositories/PostgresCharacterRepository.ts
import { Repository } from 'typeorm';

export class PostgresCharacterRepository implements CharacterRepository {
  constructor(private repo: Repository<CharacterEntity>) {}
  
  async findAll(): Promise<Character[]> {
    const characters = await this.repo.find();
    return characters.map(this.entityToDomain);
  }
  // ... implementar outros métodos
}
```

**3. Trocar na configuração:**
```typescript
// infrastructure/web/routes/characterRoutes.ts
// Antes:
// const repository = new MongoCharacterRepository();

// Depois:
const repository = new PostgresCharacterRepository(getRepository(CharacterEntity));
```

**Pronto!** Nenhuma alteração no Domain ou Application.

---

## Boas Práticas

### ✅ Fazer

1. **Manter Domain puro** - Sem dependências externas
2. **Injetar dependências** - Não criar dentro das classes
3. **Um Use Case por ação** - Single Responsibility
4. **Interfaces no Domain** - Implementações na Infrastructure
5. **Validar na camada Web** - Antes de chegar ao Use Case
6. **DTOs para transferência** - Não expor entidades diretamente
7. **Error handling apropriado** - Usar classes de erro customizadas

### ❌ Evitar

1. **Domain depender de Infrastructure** - Quebra inversão de dependência
2. **Use Cases criarem dependências** - Use injeção
3. **Lógica de negócio no Controller** - Deve estar no Use Case
4. **Expor detalhes do MongoDB** - Converter para entidades
5. **Use Cases enormes** - Dividir em casos menores
6. **Acoplamento de camadas** - Respeitar limites

---

## Recursos Adicionais

### Leitura Recomendada

- [The Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)

### Diagramas Úteis

```
Fluxo de Criação:
Client → Route → Validator → Controller → UseCase → Repository → Database

Fluxo de Leitura:
Database → Repository → UseCase → Controller → Client
```

---

Esta arquitetura garante que o sistema seja:
- **Manutenível** - Fácil de entender e modificar
- **Escalável** - Cresce sem se tornar complexo
- **Testável** - Todas as partes podem ser testadas
- **Flexível** - Mudanças são localizadas e controláveis

Para mais detalhes sobre modelos, veja [MODELS.md](MODELS.md).  
Para documentação da API, veja [API.md](API.md).
