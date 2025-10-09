# RPG Campaign Backend - Call of Cthulhu

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.10-green.svg)](https://www.mongodb.com/)

Backend REST API para gerenciamento de campanhas de RPG Call of Cthulhu, permitindo o controle de personagens, sessões, pistas e itens de campanha.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Desenvolvimento](#-desenvolvimento)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Visão Geral

Este projeto é um backend completo para gerenciar campanhas de RPG Call of Cthulhu (ou Masks of Nyarlathotep). Ele fornece uma API REST robusta para:

- **Gerenciar personagens** com atributos completos, perícias, equipamentos e saúde mental
- **Registrar sessões de jogo** com resumos, detalhes, pistas descobertas e itens obtidos
- **Buscar e filtrar** sessões por tags, localização ou termos de pesquisa
- **Rastrear sanidade** e condições mentais dos personagens

## ✨ Recursos

### Gerenciamento de Personagens

- ✅ CRUD completo de personagens
- ✅ Atributos do sistema Call of Cthulhu (FOR, CON, TAM, DES, APA, EDU, INT, POD)
- ✅ Sistema de saúde mental (sanidade, fobias, manias)
- ✅ Perícias categorizadas (combate, acadêmicas, práticas, sociais)
- ✅ Gerenciamento de equipamentos e itens
- ✅ Suporte a Talentos Pulp

### Gerenciamento de Sessões

- ✅ CRUD completo de sessões
- ✅ Registro de pistas descobertas
- ✅ Rastreamento de itens obtidos
- ✅ Sistema de tags para categorização
- ✅ Busca por texto livre
- ✅ Filtros por tags múltiplas
- ✅ Suporte a imagens

## 🛠 Tecnologias

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### Validação e Segurança

- **Joi** - Validação de esquemas
- **Helmet** - Headers de segurança HTTP
- **CORS** - Controle de acesso entre origens

### Desenvolvimento

- **ts-node-dev** - Hot reload para TypeScript
- **ESLint** - Linter de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks

## 🏗 Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizado em camadas:

```
┌─────────────────────────────────────┐
│   Infrastructure (Web, Database)   │
│  ┌──────────────────────────────┐  │
│  │   Application (Use Cases)    │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Domain (Entities)     │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Camadas

1. **Domain** - Entidades e interfaces de repositório (regras de negócio)
2. **Application** - Casos de uso (lógica de aplicação)
3. **Infrastructure** - Implementações concretas (web, database)

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Facilidade de teste
- ✅ Baixo acoplamento
- ✅ Alta coesão
- ✅ Independência de frameworks

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- MongoDB 4.4+
- npm ou yarn

### Passos

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/rpg-campaign-backend.git
cd rpg-campaign-backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rpg-campaign
NODE_ENV=development
```

4. **Inicie o MongoDB:**
```bash
# Se estiver usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou inicie o serviço local
sudo systemctl start mongod
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/rpg-campaign

# Opcional: JWT (para autenticação futura)
# JWT_SECRET=sua-chave-secreta
```

### MongoDB

A aplicação cria automaticamente as coleções necessárias:
- `characters` - Personagens
- `sessions` - Sessões de jogo

## 🚀 Uso

### Desenvolvimento

Inicie o servidor em modo de desenvolvimento com hot reload:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Produção

1. **Build do projeto:**
```bash
npm run build
```

2. **Inicie o servidor:**
```bash
npm start
```

### Testando a API

Você pode testar a API usando:

**cURL:**
```bash
# Listar todos os personagens
curl http://localhost:3000/api/characters

# Criar um novo personagem
curl -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Henry Armitage",
    "occupation": "Professor",
    "stats": {...},
    ...
  }'
```

**Postman/Insomnia:**
- Importe a coleção da API (disponível em `/docs/postman-collection.json`)

**JavaScript/TypeScript:**
```javascript
const response = await fetch('http://localhost:3000/api/characters');
const characters = await response.json();
console.log(characters);
```

## 📚 Documentação da API

A documentação completa da API está disponível em [`docs/API.md`](docs/API.md).

### Endpoints Principais

#### Personagens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/characters` | Lista todos os personagens |
| GET | `/api/characters/:id` | Busca personagem por ID |
| POST | `/api/characters` | Cria novo personagem |
| PUT | `/api/characters/:id` | Atualiza personagem |
| DELETE | `/api/characters/:id` | Remove personagem |

#### Sessões

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/sessions` | Lista todas as sessões |
| GET | `/api/sessions/:id` | Busca sessão por ID |
| GET | `/api/sessions/search?term=` | Busca sessões por termo |
| GET | `/api/sessions/tags?tags=` | Filtra por tags |
| POST | `/api/sessions` | Cria nova sessão |
| PUT | `/api/sessions/:id` | Atualiza sessão |
| DELETE | `/api/sessions/:id` | Remove sessão |

### Exemplo de Requisição

```javascript
// Criar um personagem
const character = {
  name: "Dr. Henry Armitage",
  occupation: "Professor de Literatura",
  image: "https://example.com/image.jpg",
  stats: {
    For: 50, Con: 60, Tam: 55, Des: 45,
    Apa: 50, Edu: 80, Int: 75, Pod: 65
  },
  background: "Professor renomado da Universidade Miskatonic...",
  mentalHealth: {
    sanity: 65,
    maxSanity: 80,
    tempSanity: false,
    indefiniteSanity: false,
    phobias: [],
    manias: []
  },
  skills: [
    { name: "Biblioteconomia", value: 75, category: "academic" }
  ],
  equipment: [],
  pulpTalents: ["Erudito"],
  wounds: 0,
  maxHealth: 11
};

const response = await fetch('http://localhost:3000/api/characters', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(character)
});

const createdCharacter = await response.json();
```

## 📁 Estrutura do Projeto

```
rpg-campaign-backend/
├── application/              # Camada de aplicação
│   └── useCases/            # Casos de uso
│       ├── character/       # Use cases de personagens
│       └── session/         # Use cases de sessões
├── domain/                  # Camada de domínio
│   ├── entities/           # Entidades do domínio
│   └── repositories/       # Interfaces de repositório
├── infrastructure/          # Camada de infraestrutura
│   ├── database/           # Configuração e modelos do banco
│   │   ├── models/         # Modelos Mongoose
│   │   └── repositories/   # Implementações de repositório
│   └── web/                # Configuração web
│       ├── controllers/    # Controladores HTTP
│       ├── routes/         # Definição de rotas
│       ├── validators/     # Validadores Joi
│       └── middlewares/    # Middlewares Express
├── shared/                  # Código compartilhado
│   └── errors/             # Classes de erro
├── docs/                    # Documentação
│   ├── API.md              # Documentação da API
│   ├── ARCHITECTURE.md     # Guia de arquitetura
│   └── MODELS.md           # Documentação de modelos
├── server.ts               # Ponto de entrada
├── package.json            # Dependências
└── tsconfig.json           # Configuração TypeScript
```

### Descrição das Pastas

- **`application/`** - Lógica de aplicação e orquestração
- **`domain/`** - Regras de negócio e entidades
- **`infrastructure/`** - Detalhes de implementação (BD, Web)
- **`shared/`** - Utilitários e código compartilhado
- **`docs/`** - Documentação do projeto

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com hot reload

# Build e Produção
npm run build        # Compila TypeScript para JavaScript
npm start           # Inicia servidor de produção

# Qualidade de Código
npm run lint        # Executa ESLint
npm run format      # Formata código com Prettier
npm test           # Executa testes (quando implementados)
```

## 🔧 Desenvolvimento

### Adicionando Novo Caso de Uso

1. **Crie a interface no domínio** (se necessário)
2. **Crie o caso de uso** em `application/useCases/`
3. **Adicione ao controlador** em `infrastructure/web/controllers/`
4. **Configure a rota** em `infrastructure/web/routes/`

Exemplo:
```typescript
// 1. application/useCases/character/ArchiveCharacter.ts
export class ArchiveCharacterUseCase {
  constructor(private repository: CharacterRepository) {}
  
  async execute(id: string): Promise<void> {
    const character = await this.repository.findById(id);
    // lógica de arquivamento
    await this.repository.update(id, { archived: true });
  }
}

// 2. Adicionar ao controller e route
```

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Documentação da API](docs/API.md)
- [Guia de Arquitetura](docs/ARCHITECTURE.md)
- [Modelos de Dados](docs/MODELS.md)
- [Call of Cthulhu RPG](https://www.chaosium.com/call-of-cthulhu-rpg/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
