# Documentação da API

## Visão Geral

Esta API REST fornece endpoints para gerenciar personagens e sessões de campanha de RPG Call of Cthulhu. A API foi construída usando Express.js com TypeScript e segue os princípios da Clean Architecture.

**Base URL:** `http://localhost:3000` (ou a porta configurada em `PORT`)

## Índice

- [Autenticação](#autenticação)
- [Personagens (Characters)](#personagens-characters)
- [Sessões (Sessions)](#sessões-sessions)
- [Tratamento de Erros](#tratamento-de-erros)
- [Modelos de Dados](#modelos-de-dados)

---

## Autenticação

Atualmente, a API não requer autenticação. Em produção, considere implementar autenticação JWT ou similar.

---

## Personagens (Characters)

Endpoints para gerenciar personagens de RPG.

### Listar Todos os Personagens

Recupera uma lista de todos os personagens cadastrados.

**Endpoint:** `GET /api/characters`

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:**
```json
[
  {
    "id": "64f5e3b2c1a2b3c4d5e6f7g8",
    "name": "Dr. Henry Armitage",
    "occupation": "Professor de Literatura",
    "image": "https://example.com/image.jpg",
    "stats": {
      "For": 50,
      "Con": 60,
      "Tam": 55,
      "Des": 45,
      "Apa": 50,
      "Edu": 80,
      "Int": 75,
      "Pod": 65
    },
    "background": "Professor renomado da Universidade Miskatonic...",
    "mentalHealth": {
      "sanity": 65,
      "maxSanity": 80,
      "tempSanity": false,
      "indefiniteSanity": false,
      "phobias": [],
      "manias": []
    },
    "skills": [
      {
        "name": "Biblioteconomia",
        "value": 75,
        "category": "academic"
      }
    ],
    "equipment": [
      {
        "name": "Livro Raro",
        "description": "Tomo antigo sobre ocultismo",
        "type": "book"
      }
    ],
    "pulpTalents": ["Erudito"],
    "wounds": 0,
    "maxHealth": 11,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Exemplo de Uso:**
```bash
curl -X GET http://localhost:3000/api/characters
```

```javascript
// JavaScript/TypeScript
const response = await fetch('http://localhost:3000/api/characters');
const characters = await response.json();
console.log(characters);
```

---

### Buscar Personagem por ID

Recupera um personagem específico pelo seu ID.

**Endpoint:** `GET /api/characters/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID do personagem

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Objeto do personagem (veja exemplo acima)

**Resposta de Erro:**
- **Código:** 404 Not Found
- **Conteúdo:**
```json
{
  "message": "Character not found"
}
```

**Exemplo de Uso:**
```bash
curl -X GET http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8
```

```javascript
const response = await fetch('http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8');
const character = await response.json();
```

---

### Criar Novo Personagem

Cria um novo personagem.

**Endpoint:** `POST /api/characters`

**Headers:**
```
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "name": "Dr. Henry Armitage",
  "occupation": "Professor de Literatura",
  "image": "https://example.com/image.jpg",
  "stats": {
    "For": 50,
    "Con": 60,
    "Tam": 55,
    "Des": 45,
    "Apa": 50,
    "Edu": 80,
    "Int": 75,
    "Pod": 65
  },
  "background": "Professor renomado da Universidade Miskatonic...",
  "mentalHealth": {
    "sanity": 65,
    "maxSanity": 80,
    "tempSanity": false,
    "indefiniteSanity": false,
    "phobias": [],
    "manias": []
  },
  "skills": [
    {
      "name": "Biblioteconomia",
      "value": 75,
      "category": "academic"
    }
  ],
  "equipment": [
    {
      "name": "Livro Raro",
      "description": "Tomo antigo sobre ocultismo",
      "type": "book"
    }
  ],
  "pulpTalents": ["Erudito"],
  "wounds": 0,
  "maxHealth": 11
}
```

**Resposta de Sucesso:**
- **Código:** 201 Created
- **Conteúdo:** Objeto do personagem criado com `id`, `createdAt` e `updatedAt`

**Resposta de Erro:**
- **Código:** 400 Bad Request
- **Conteúdo:**
```json
{
  "message": "Validation error message"
}
```

**Exemplo de Uso:**
```bash
curl -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Henry Armitage",
    "occupation": "Professor",
    "stats": {...},
    ...
  }'
```

```javascript
const newCharacter = {
  name: "Dr. Henry Armitage",
  occupation: "Professor de Literatura",
  // ... outros campos
};

const response = await fetch('http://localhost:3000/api/characters', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newCharacter),
});

const character = await response.json();
```

---

### Atualizar Personagem

Atualiza um personagem existente.

**Endpoint:** `PUT /api/characters/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID do personagem

**Headers:**
```
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "name": "Dr. Henry Armitage (Atualizado)",
  "wounds": 2,
  "mentalHealth": {
    "sanity": 60,
    "maxSanity": 80,
    "tempSanity": true,
    "indefiniteSanity": false,
    "phobias": ["Escuridão"],
    "manias": []
  }
}
```

**Nota:** Você pode enviar apenas os campos que deseja atualizar.

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Objeto do personagem atualizado

**Resposta de Erro:**
- **Código:** 404 Not Found
```json
{
  "message": "Character not found"
}
```

**Exemplo de Uso:**
```bash
curl -X PUT http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8 \
  -H "Content-Type: application/json" \
  -d '{"wounds": 2}'
```

```javascript
const updates = {
  wounds: 2,
  mentalHealth: {
    ...character.mentalHealth,
    sanity: 60
  }
};

const response = await fetch('http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updates),
});
```

---

### Deletar Personagem

Remove um personagem do sistema.

**Endpoint:** `DELETE /api/characters/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID do personagem

**Resposta de Sucesso:**
- **Código:** 204 No Content

**Resposta de Erro:**
- **Código:** 404 Not Found
```json
{
  "message": "Character not found"
}
```

**Exemplo de Uso:**
```bash
curl -X DELETE http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8
```

```javascript
const response = await fetch('http://localhost:3000/api/characters/64f5e3b2c1a2b3c4d5e6f7g8', {
  method: 'DELETE',
});

if (response.status === 204) {
  console.log('Personagem deletado com sucesso');
}
```

---

## Sessões (Sessions)

Endpoints para gerenciar sessões de campanha de RPG.

### Listar Todas as Sessões

Recupera uma lista de todas as sessões cadastradas.

**Endpoint:** `GET /api/sessions`

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:**
```json
[
  {
    "id": "64f5e3b2c1a2b3c4d5e6f7g9",
    "title": "O Mistério da Mansão Corbitt",
    "date": "2024-01-20",
    "location": "Arkham - Mansão Corbitt",
    "summary": "Os investigadores descobrem pistas sobre cultos antigos...",
    "details": "A sessão começou com os investigadores recebendo uma carta misteriosa...",
    "tags": ["investigação", "horror", "arkham"],
    "images": ["https://example.com/mansion.jpg"],
    "clues": [
      {
        "id": "clue1",
        "name": "Carta Antiga",
        "description": "Uma carta com símbolos estranhos",
        "type": "document",
        "tag": "investigação",
        "location": "Biblioteca"
      }
    ],
    "items": [
      {
        "id": "item1",
        "name": "Lanterna",
        "description": "Lanterna a óleo",
        "type": "equipment"
      }
    ],
    "createdAt": "2024-01-20T19:00:00.000Z",
    "updatedAt": "2024-01-20T19:00:00.000Z"
  }
]
```

**Exemplo de Uso:**
```bash
curl -X GET http://localhost:3000/api/sessions
```

```javascript
const response = await fetch('http://localhost:3000/api/sessions');
const sessions = await response.json();
```

---

### Buscar Sessão por ID

Recupera uma sessão específica pelo seu ID.

**Endpoint:** `GET /api/sessions/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID da sessão

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Objeto da sessão (veja exemplo acima)

**Resposta de Erro:**
- **Código:** 404 Not Found
```json
{
  "message": "Session not found"
}
```

**Exemplo de Uso:**
```bash
curl -X GET http://localhost:3000/api/sessions/64f5e3b2c1a2b3c4d5e6f7g9
```

---

### Buscar Sessões

Busca sessões por termo de pesquisa (título, localização ou resumo).

**Endpoint:** `GET /api/sessions/search?term=arkham`

**Parâmetros de Query:**
- `term` (string, obrigatório) - Termo de busca

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Array de sessões que correspondem à busca

**Resposta de Erro:**
- **Código:** 400 Bad Request
```json
{
  "message": "Search term is required"
}
```

**Exemplo de Uso:**
```bash
curl -X GET "http://localhost:3000/api/sessions/search?term=arkham"
```

```javascript
const searchTerm = 'arkham';
const response = await fetch(`http://localhost:3000/api/sessions/search?term=${encodeURIComponent(searchTerm)}`);
const sessions = await response.json();
```

---

### Filtrar Sessões por Tags

Filtra sessões por uma ou mais tags.

**Endpoint:** `GET /api/sessions/tags?tags=investigação&tags=horror`

**Parâmetros de Query:**
- `tags` (string ou array, obrigatório) - Uma ou mais tags para filtrar

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Array de sessões que contêm as tags especificadas

**Exemplo de Uso:**
```bash
# Uma tag
curl -X GET "http://localhost:3000/api/sessions/tags?tags=investigação"

# Múltiplas tags
curl -X GET "http://localhost:3000/api/sessions/tags?tags=investigação&tags=horror"
```

```javascript
// Uma tag
const response = await fetch('http://localhost:3000/api/sessions/tags?tags=investigação');

// Múltiplas tags
const tags = ['investigação', 'horror'];
const queryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
const response = await fetch(`http://localhost:3000/api/sessions/tags?${queryString}`);
const sessions = await response.json();
```

---

### Criar Nova Sessão

Cria uma nova sessão de campanha.

**Endpoint:** `POST /api/sessions`

**Headers:**
```
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "title": "O Mistério da Mansão Corbitt",
  "date": "2024-01-20",
  "location": "Arkham - Mansão Corbitt",
  "summary": "Os investigadores descobrem pistas sobre cultos antigos...",
  "details": "A sessão começou com os investigadores recebendo uma carta misteriosa...",
  "tags": ["investigação", "horror", "arkham"],
  "images": ["https://example.com/mansion.jpg"],
  "clues": [
    {
      "id": "clue1",
      "name": "Carta Antiga",
      "description": "Uma carta com símbolos estranhos",
      "type": "document",
      "tag": "investigação",
      "location": "Biblioteca"
    }
  ],
  "items": [
    {
      "id": "item1",
      "name": "Lanterna",
      "description": "Lanterna a óleo",
      "type": "equipment"
    }
  ]
}
```

**Resposta de Sucesso:**
- **Código:** 201 Created
- **Conteúdo:** Objeto da sessão criada com `id`, `createdAt` e `updatedAt`

**Resposta de Erro:**
- **Código:** 400 Bad Request
```json
{
  "message": "Validation error message",
  "details": [...]
}
```

**Exemplo de Uso:**
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "O Mistério da Mansão Corbitt",
    "date": "2024-01-20",
    "location": "Arkham",
    "summary": "Investigação na mansão...",
    "details": "Detalhes completos...",
    "tags": ["investigação"],
    "images": [],
    "clues": [],
    "items": []
  }'
```

```javascript
const newSession = {
  title: "O Mistério da Mansão Corbitt",
  date: "2024-01-20",
  location: "Arkham - Mansão Corbitt",
  summary: "Os investigadores descobrem pistas...",
  details: "A sessão começou...",
  tags: ["investigação", "horror"],
  images: [],
  clues: [],
  items: []
};

const response = await fetch('http://localhost:3000/api/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newSession),
});

const session = await response.json();
```

---

### Atualizar Sessão

Atualiza uma sessão existente.

**Endpoint:** `PUT /api/sessions/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID da sessão

**Headers:**
```
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "title": "O Mistério da Mansão Corbitt (Atualizado)",
  "tags": ["investigação", "horror", "arkham", "resolvido"]
}
```

**Nota:** Você pode enviar apenas os campos que deseja atualizar.

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Conteúdo:** Objeto da sessão atualizada

**Resposta de Erro:**
- **Código:** 404 Not Found
```json
{
  "message": "Session not found"
}
```

**Exemplo de Uso:**
```bash
curl -X PUT http://localhost:3000/api/sessions/64f5e3b2c1a2b3c4d5e6f7g9 \
  -H "Content-Type: application/json" \
  -d '{"tags": ["investigação", "horror", "resolvido"]}'
```

---

### Deletar Sessão

Remove uma sessão do sistema.

**Endpoint:** `DELETE /api/sessions/:id`

**Parâmetros de URL:**
- `id` (string, obrigatório) - ID da sessão

**Resposta de Sucesso:**
- **Código:** 204 No Content

**Resposta de Erro:**
- **Código:** 404 Not Found
```json
{
  "message": "Session not found"
}
```

**Exemplo de Uso:**
```bash
curl -X DELETE http://localhost:3000/api/sessions/64f5e3b2c1a2b3c4d5e6f7g9
```

```javascript
const response = await fetch('http://localhost:3000/api/sessions/64f5e3b2c1a2b3c4d5e6f7g9', {
  method: 'DELETE',
});

if (response.status === 204) {
  console.log('Sessão deletada com sucesso');
}
```

---

## Tratamento de Erros

A API utiliza códigos de status HTTP padrão para indicar sucesso ou falha:

### Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida sem conteúdo de retorno |
| 400 | Bad Request - Erro de validação ou parâmetros inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

### Formato de Erro

Todas as respostas de erro seguem este formato:

```json
{
  "message": "Descrição do erro"
}
```

Em casos de erro de validação, podem incluir detalhes adicionais:

```json
{
  "message": "Validation error",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

---

## Modelos de Dados

### Character (Personagem)

```typescript
interface Character {
  id: string;                    // ID único do personagem
  name: string;                  // Nome do personagem
  occupation: string;            // Ocupação/Profissão
  image: string;                 // URL da imagem do personagem
  stats: Stats;                  // Atributos do personagem
  background: string;            // História do personagem
  mentalHealth: MentalHealth;    // Saúde mental
  skills: Skill[];               // Perícias
  equipment: Equipment[];        // Equipamentos
  pulpTalents: string[];         // Talentos pulp
  wounds: number;                // Ferimentos atuais
  maxHealth: number;             // Pontos de vida máximos
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}
```

### Stats (Atributos)

```typescript
interface Stats {
  For: number;  // Força
  Con: number;  // Constituição
  Tam: number;  // Tamanho
  Des: number;  // Destreza
  Apa: number;  // Aparência
  Edu: number;  // Educação
  Int: number;  // Inteligência
  Pod: number;  // Poder
}
```

### MentalHealth (Saúde Mental)

```typescript
interface MentalHealth {
  sanity: number;              // Sanidade atual
  maxSanity: number;           // Sanidade máxima
  tempSanity: boolean;         // Insanidade temporária
  indefiniteSanity: boolean;   // Insanidade indefinida
  phobias: string[];           // Fobias adquiridas
  manias: string[];            // Manias adquiridas
}
```

### Skill (Perícia)

```typescript
interface Skill {
  name: string;                              // Nome da perícia
  value: number;                             // Valor da perícia (0-100)
  category: 'combat' | 'academic' | 'pratical' | 'social';  // Categoria
}
```

### Equipment (Equipamento)

```typescript
interface Equipment {
  name: string;                              // Nome do item
  description: string;                       // Descrição
  type: 'weapon' | 'tool' | 'book' | 'artifact';  // Tipo
}
```

### Session (Sessão)

```typescript
interface Session {
  id: string;           // ID único da sessão
  title: string;        // Título da sessão
  date: string;         // Data da sessão (formato: YYYY-MM-DD)
  location: string;     // Localização onde ocorreu
  summary: string;      // Resumo da sessão
  details: string;      // Detalhes completos
  tags: string[];       // Tags para categorização
  images: string[];     // URLs das imagens
  clues: Clue[];        // Pistas descobertas
  items: Item[];        // Itens obtidos
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}
```

### Clue (Pista)

```typescript
interface Clue {
  id: string;           // ID único da pista
  name: string;         // Nome da pista
  description: string;  // Descrição
  type: string;         // Tipo (ex: document, physical, testimony)
  image?: string;       // URL da imagem (opcional)
  tag?: string;         // Tag relacionada (opcional)
  location?: string;    // Local onde foi encontrada (opcional)
}
```

### Item (Item)

```typescript
interface Item {
  id: string;           // ID único do item
  name: string;         // Nome do item
  description: string;  // Descrição
  type: string;         // Tipo do item
}
```

---

## Exemplos de Integração

### React/Next.js

```typescript
// services/api.ts
const API_BASE_URL = 'http://localhost:3000/api';

export const characterService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/characters`);
    return response.json();
  },
  
  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`);
    if (!response.ok) throw new Error('Character not found');
    return response.json();
  },
  
  async create(data: CreateCharacterDTO) {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  async update(id: string, data: Partial<Character>) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  async delete(id: string) {
    await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'DELETE',
    });
  },
};

export const sessionService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    return response.json();
  },
  
  async search(term: string) {
    const response = await fetch(`${API_BASE_URL}/sessions/search?term=${encodeURIComponent(term)}`);
    return response.json();
  },
  
  async filterByTags(tags: string[]) {
    const queryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const response = await fetch(`${API_BASE_URL}/sessions/tags?${queryString}`);
    return response.json();
  },
  
  async create(data: CreateSessionDTO) {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### Python

```python
import requests
from typing import List, Dict, Optional

class RPGCampaignAPI:
    def __init__(self, base_url: str = "http://localhost:3000/api"):
        self.base_url = base_url
    
    # Characters
    def get_characters(self) -> List[Dict]:
        response = requests.get(f"{self.base_url}/characters")
        response.raise_for_status()
        return response.json()
    
    def get_character(self, character_id: str) -> Dict:
        response = requests.get(f"{self.base_url}/characters/{character_id}")
        response.raise_for_status()
        return response.json()
    
    def create_character(self, character_data: Dict) -> Dict:
        response = requests.post(
            f"{self.base_url}/characters",
            json=character_data
        )
        response.raise_for_status()
        return response.json()
    
    # Sessions
    def get_sessions(self) -> List[Dict]:
        response = requests.get(f"{self.base_url}/sessions")
        response.raise_for_status()
        return response.json()
    
    def search_sessions(self, term: str) -> List[Dict]:
        response = requests.get(
            f"{self.base_url}/sessions/search",
            params={"term": term}
        )
        response.raise_for_status()
        return response.json()
    
    def filter_sessions_by_tags(self, tags: List[str]) -> List[Dict]:
        response = requests.get(
            f"{self.base_url}/sessions/tags",
            params={"tags": tags}
        )
        response.raise_for_status()
        return response.json()

# Uso
api = RPGCampaignAPI()
characters = api.get_characters()
sessions = api.search_sessions("arkham")
```

---

## Notas Adicionais

### CORS

A API possui CORS habilitado para permitir requisições de diferentes origens. Certifique-se de configurar adequadamente em produção.

### Validação

Todos os endpoints que recebem dados (POST, PUT) utilizam validação com Joi. Os erros de validação retornam código 400 com detalhes do erro.

### MongoDB

A aplicação utiliza MongoDB como banco de dados. Certifique-se de configurar a string de conexão no arquivo `.env`:

```
MONGODB_URI=mongodb://localhost:27017/rpg-campaign
PORT=3000
```

### Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para build de produção:

```bash
npm run build
npm start
```
