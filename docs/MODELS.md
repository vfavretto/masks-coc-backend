# Documentação de Modelos de Dados

Esta documentação descreve em detalhes todos os modelos de dados, entidades e interfaces utilizadas no sistema de gerenciamento de campanhas de RPG Call of Cthulhu.

## Índice

- [Visão Geral](#visão-geral)
- [Character (Personagem)](#character-personagem)
- [Session (Sessão)](#session-sessão)
- [Tipos Auxiliares](#tipos-auxiliares)
- [Validações](#validações)
- [Exemplos Completos](#exemplos-completos)

---

## Visão Geral

O sistema utiliza dois modelos principais:

1. **Character** - Representa um personagem jogador (PJ) ou NPC
2. **Session** - Representa uma sessão de jogo da campanha

Ambos os modelos são definidos como interfaces TypeScript no domínio e implementados como schemas Mongoose na camada de infraestrutura.

---

## Character (Personagem)

Representa um personagem no sistema Call of Cthulhu com todos os atributos, perícias e informações de jogo.

### Interface Completa

```typescript
interface Character {
  id: string;
  name: string;
  occupation: string;
  image: string;
  stats: Stats;
  background: string;
  mentalHealth: MentalHealth;
  skills: Skill[];
  equipment: Equipment[];
  pulpTalents: string[];
  wounds: number;
  maxHealth: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Propriedades

| Propriedade | Tipo | Descrição | Obrigatório |
|-------------|------|-----------|-------------|
| `id` | string | Identificador único do personagem | Sim (gerado) |
| `name` | string | Nome completo do personagem | Sim |
| `occupation` | string | Ocupação/Profissão do personagem | Sim |
| `image` | string | URL da imagem do personagem | Sim |
| `stats` | Stats | Atributos do personagem | Sim |
| `background` | string | História e background do personagem | Sim |
| `mentalHealth` | MentalHealth | Estado de saúde mental | Sim |
| `skills` | Skill[] | Array de perícias | Sim |
| `equipment` | Equipment[] | Array de equipamentos | Sim |
| `pulpTalents` | string[] | Talentos pulp (opcional) | Sim |
| `wounds` | number | Ferimentos atuais (0+) | Sim |
| `maxHealth` | number | Pontos de vida máximos | Sim |
| `createdAt` | Date | Data de criação do registro | Sim (auto) |
| `updatedAt` | Date | Data da última atualização | Sim (auto) |

### Exemplo

```json
{
  "id": "64f5e3b2c1a2b3c4d5e6f7g8",
  "name": "Dr. Henry Armitage",
  "occupation": "Professor de Literatura Ocultista",
  "image": "https://example.com/dr-armitage.jpg",
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
  "background": "Professor renomado da Universidade Miskatonic, especialista em textos antigos e linguagens mortas. Passou décadas estudando os mistérios ocultos que rondam Arkham e Dunwich.",
  "mentalHealth": {
    "sanity": 65,
    "maxSanity": 80,
    "tempSanity": false,
    "indefiniteSanity": false,
    "phobias": ["Escuridão total"],
    "manias": ["Compulsão por catalogar conhecimento proibido"]
  },
  "skills": [
    {
      "name": "Biblioteconomia",
      "value": 75,
      "category": "academic"
    },
    {
      "name": "Línguas (Latim)",
      "value": 60,
      "category": "academic"
    },
    {
      "name": "Ocultismo",
      "value": 70,
      "category": "academic"
    },
    {
      "name": "Persuasão",
      "value": 55,
      "category": "social"
    }
  ],
  "equipment": [
    {
      "name": "Necronomicon (tradução latina)",
      "description": "Cópia rara e perigosa do tomo proibido",
      "type": "book"
    },
    {
      "name": "Revólver .38",
      "description": "Para emergências",
      "type": "weapon"
    },
    {
      "name": "Lente de aumento",
      "description": "Para examinar textos antigos",
      "type": "tool"
    }
  ],
  "pulpTalents": [
    "Erudito (ganha +1 dado bônus em testes de Educação)",
    "Resiliente (recupera sanidade mais rapidamente)"
  ],
  "wounds": 0,
  "maxHealth": 11,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Stats (Atributos)

Representa os atributos numéricos do personagem no sistema Call of Cthulhu.

### Interface

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

### Propriedades

| Atributo | Nome Completo | Intervalo | Descrição |
|----------|---------------|-----------|-----------|
| `For` | Força | 15-90 | Força física bruta |
| `Con` | Constituição | 15-90 | Resistência e saúde |
| `Tam` | Tamanho | 40-90 | Massa e estatura |
| `Des` | Destreza | 15-90 | Agilidade e coordenação |
| `Apa` | Aparência | 15-90 | Atratividade física |
| `Edu` | Educação | 15-99 | Conhecimento acadêmico |
| `Int` | Inteligência | 15-90 | Capacidade mental |
| `Pod` | Poder | 15-90 | Força de vontade e sorte |

### Exemplo

```json
{
  "For": 50,
  "Con": 60,
  "Tam": 55,
  "Des": 45,
  "Apa": 50,
  "Edu": 80,
  "Int": 75,
  "Pod": 65
}
```

### Atributos Derivados

Alguns valores são calculados a partir dos atributos base:

```typescript
// Pontos de Vida
const maxHealth = Math.floor((stats.Con + stats.Tam) / 10);

// Sanidade Máxima
const maxSanity = stats.Pod;

// Pontos de Magia
const magicPoints = Math.floor(stats.Pod / 5);

// Taxa de Movimento
let moveRate = 8;
if (stats.Des < stats.Tam && stats.For < stats.Tam) moveRate = 7;
if (stats.Des >= stats.Tam && stats.For >= stats.Tam) moveRate = 9;
```

---

## MentalHealth (Saúde Mental)

Rastreia o estado de saúde mental do personagem, incluindo sanidade, insanidade e traumas.

### Interface

```typescript
interface MentalHealth {
  sanity: number;
  maxSanity: number;
  tempSanity: boolean;
  indefiniteSanity: boolean;
  phobias: string[];
  manias: string[];
}
```

### Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `sanity` | number | Pontos de sanidade atuais (0-99) |
| `maxSanity` | number | Sanidade máxima possível (geralmente igual a POD) |
| `tempSanity` | boolean | Se possui insanidade temporária ativa |
| `indefiniteSanity` | boolean | Se possui insanidade indefinida |
| `phobias` | string[] | Lista de fobias adquiridas |
| `manias` | string[] | Lista de manias adquiridas |

### Exemplo

```json
{
  "sanity": 45,
  "maxSanity": 65,
  "tempSanity": false,
  "indefiniteSanity": false,
  "phobias": [
    "Medo de lugares fechados (Claustrofobia)",
    "Medo de profundezas oceânicas"
  ],
  "manias": [
    "Compulsão por lavar as mãos",
    "Necessidade de verificar fechaduras múltiplas vezes"
  ]
}
```

### Regras de Sanidade

#### Perda de Sanidade

Quando um personagem perde sanidade:
- **0-4 pontos**: Sem efeito imediato
- **5+ pontos de uma vez**: Teste de Sanidade (dificuldade variável)
- **Sanidade cai para 0**: Insanidade permanente

#### Recuperação

```typescript
// Por sessão de jogo
const recoveryPerSession = 1; // 1d6 em alguns casos

// Por resolver mistérios
const recoveryByMystery = 1d10; // Varia por magnitude

// Terapia
const therapyRecovery = 1d3; // Por mês de tratamento
```

---

## Skill (Perícia)

Representa uma perícia ou habilidade do personagem.

### Interface

```typescript
interface Skill {
  name: string;
  value: number;
  category: 'combat' | 'academic' | 'pratical' | 'social';
}
```

### Propriedades

| Propriedade | Tipo | Valores | Descrição |
|-------------|------|---------|-----------|
| `name` | string | - | Nome da perícia |
| `value` | number | 0-100 | Valor percentual da perícia |
| `category` | string | combat, academic, pratical, social | Categoria |

### Categorias de Perícias

#### Combat (Combate)
- Armas de Fogo (Pistola, Rifle, Espingarda)
- Lutar (Briga)
- Esquiva

#### Academic (Acadêmicas)
- Biblioteconomia
- Ciências (várias)
- História
- Línguas
- Ocultismo
- Medicina

#### Pratical (Práticas)
- Chaveiro
- Consertos Mecânicos
- Dirigir Auto
- Operar Maquinário Pesado
- Primeiros Socorros

#### Social (Sociais)
- Charme
- Intimidação
- Lábia
- Persuasão
- Psicologia

### Exemplo

```json
{
  "skills": [
    {
      "name": "Biblioteconomia",
      "value": 75,
      "category": "academic"
    },
    {
      "name": "Ocultismo",
      "value": 65,
      "category": "academic"
    },
    {
      "name": "Armas de Fogo (Pistola)",
      "value": 40,
      "category": "combat"
    },
    {
      "name": "Persuasão",
      "value": 55,
      "category": "social"
    },
    {
      "name": "Primeiros Socorros",
      "value": 50,
      "category": "pratical"
    }
  ]
}
```

---

## Equipment (Equipamento)

Representa itens, armas, ferramentas e artefatos que o personagem possui.

### Interface

```typescript
interface Equipment {
  name: string;
  description: string;
  type: 'weapon' | 'tool' | 'book' | 'artifact';
}
```

### Propriedades

| Propriedade | Tipo | Valores | Descrição |
|-------------|------|---------|-----------|
| `name` | string | - | Nome do item |
| `description` | string | - | Descrição detalhada |
| `type` | string | weapon, tool, book, artifact | Tipo do equipamento |

### Tipos de Equipamento

#### weapon (Armas)
Qualquer item usado para combate.

```json
{
  "name": "Revólver .38",
  "description": "Revólver Smith & Wesson, 6 tiros, alcance efetivo 15m",
  "type": "weapon"
}
```

#### tool (Ferramentas)
Itens práticos e utilitários.

```json
{
  "name": "Kit de Chaveiro",
  "description": "Conjunto completo de gazuas e ferramentas de arrombamento",
  "type": "tool"
}
```

#### book (Livros)
Tomos, grimórios e textos (podem conter conhecimento místico).

```json
{
  "name": "Necronomicon",
  "description": "Tradução latina do tomo proibido. Sanidade -1d6, Mitos de Cthulhu +7%",
  "type": "book"
}
```

#### artifact (Artefatos)
Objetos místicos ou históricos especiais.

```json
{
  "name": "Talismã de Proteção",
  "description": "Amuleto antigo com símbolos de Elder Sign. Fornece +1 dado bônus contra magias",
  "type": "artifact"
}
```

---

## Session (Sessão)

Representa uma sessão de jogo da campanha, incluindo eventos, pistas e itens descobertos.

### Interface Completa

```typescript
interface Session {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  details: string;
  tags: string[];
  images: string[];
  clues: Clue[];
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Propriedades

| Propriedade | Tipo | Descrição | Obrigatório |
|-------------|------|-----------|-------------|
| `id` | string | Identificador único da sessão | Sim (gerado) |
| `title` | string | Título da sessão | Sim |
| `date` | string | Data da sessão (YYYY-MM-DD) | Sim |
| `location` | string | Local onde ocorreu a sessão | Sim |
| `summary` | string | Resumo breve dos eventos | Sim |
| `details` | string | Descrição detalhada da sessão | Sim |
| `tags` | string[] | Tags para categorização | Sim |
| `images` | string[] | URLs de imagens relacionadas | Sim |
| `clues` | Clue[] | Pistas descobertas | Sim |
| `items` | Item[] | Itens obtidos | Sim |
| `createdAt` | Date | Data de criação do registro | Sim (auto) |
| `updatedAt` | Date | Data da última atualização | Sim (auto) |

### Exemplo

```json
{
  "id": "64f5e3b2c1a2b3c4d5e6f7g9",
  "title": "Capítulo 1: O Mistério da Mansão Corbitt",
  "date": "2024-01-20",
  "location": "Arkham, Massachusetts - Mansão Corbitt",
  "summary": "Os investigadores recebem uma carta misteriosa de um antigo colega, levando-os a uma mansão abandonada onde descobrem pistas perturbadoras sobre um culto esquecido.",
  "details": "A sessão começou com os investigadores - Dr. Armitage, Sarah Blackwood e Thomas Kane - recebendo uma carta urgente de seu colega Prof. Wilmarth, que desapareceu após investigar a antiga Mansão Corbitt.\n\nAo chegarem à mansão no crepúsculo, encontraram as portas abertas e sinais de luta recente. No porão, descobriram um altar profano e símbolos que nenhum deles reconheceu. Sarah fez um teste de Ocultismo (sucesso extremo) e identificou os símbolos como pertencentes ao culto de Nyarlathotep.\n\nUm combate breve ocorreu contra cultistas que haviam permanecido na mansão. Thomas foi ferido (2 pontos de dano), mas o grupo prevaleceu. No escritório do segundo andar, encontraram o diário de Wilmarth, revelando suas descobertas sobre encontros secretos do culto.\n\nA sessão terminou com os investigadores fugindo da mansão quando ela começou a desmoronar misteriosamente. Todos perderam 1d4 de sanidade devido aos eventos testemunhados.",
  "tags": ["investigação", "combate", "arkham", "culto", "nyarlathotep"],
  "images": [
    "https://example.com/corbitt-mansion-exterior.jpg",
    "https://example.com/basement-altar.jpg",
    "https://example.com/wilmarth-diary.jpg"
  ],
  "clues": [
    {
      "id": "clue1",
      "name": "Diário do Prof. Wilmarth",
      "description": "Diário detalhando investigações sobre o culto de Nyarlathotep em Arkham. Menciona encontros semanais e um ritual planejado para o próximo equinócio.",
      "type": "document",
      "image": "https://example.com/diary-page.jpg",
      "tag": "nyarlathotep",
      "location": "Escritório - Mansão Corbitt"
    },
    {
      "id": "clue2",
      "name": "Símbolo do Faraó Negro",
      "description": "Símbolo entalhado no altar do porão, associado a Nyarlathotep em sua forma de Faraó Negro.",
      "type": "physical",
      "tag": "culto",
      "location": "Porão - Mansão Corbitt"
    },
    {
      "id": "clue3",
      "name": "Lista de Membros do Culto",
      "description": "Papel com nomes e endereços de supostos membros do culto. Inclui figuras proeminentes de Arkham.",
      "type": "document",
      "tag": "investigação",
      "location": "Escritório - Mansão Corbitt"
    }
  ],
  "items": [
    {
      "id": "item1",
      "name": "Diário do Prof. Wilmarth",
      "description": "Pode ser consultado para +1 dado bônus em testes relacionados ao culto",
      "type": "book"
    },
    {
      "id": "item2",
      "name": "Adaga Ritual",
      "description": "Adaga cerimonial encontrada no altar. 1d4+2 de dano, +5% em testes de Ocultismo quando utilizada em rituais",
      "type": "weapon"
    }
  ],
  "createdAt": "2024-01-20T22:30:00.000Z",
  "updatedAt": "2024-01-20T22:30:00.000Z"
}
```

---

## Clue (Pista)

Representa uma pista ou evidência descoberta durante uma sessão.

### Interface

```typescript
interface Clue {
  id: string;
  name: string;
  description: string;
  type: string;
  image?: string;
  tag?: string;
  location?: string;
}
```

### Propriedades

| Propriedade | Tipo | Descrição | Obrigatório |
|-------------|------|-----------|-------------|
| `id` | string | Identificador único da pista | Sim |
| `name` | string | Nome/título da pista | Sim |
| `description` | string | Descrição detalhada | Sim |
| `type` | string | Tipo de pista (document, physical, testimony, etc.) | Sim |
| `image` | string | URL de imagem da pista | Não |
| `tag` | string | Tag relacionada | Não |
| `location` | string | Onde foi encontrada | Não |

### Tipos Comuns de Pistas

- **document** - Documentos, cartas, diários
- **physical** - Evidências físicas, objetos
- **testimony** - Depoimentos, conversas
- **supernatural** - Pistas de natureza sobrenatural
- **forensic** - Evidências forenses

### Exemplo

```json
{
  "clues": [
    {
      "id": "clue1",
      "name": "Carta Ameaçadora",
      "description": "Carta enviada a um dos investigadores, escrita em tinta vermelha, ameaçando consequências terríveis se a investigação continuar.",
      "type": "document",
      "image": "https://example.com/threatening-letter.jpg",
      "tag": "investigação",
      "location": "Correio - Recebida em 15/01/2024"
    },
    {
      "id": "clue2",
      "name": "Fragmento de Tecido",
      "description": "Pedaço de tecido negro com fibras incomuns, encontrado no local do crime. Análise revela que não é de origem terrestre.",
      "type": "physical",
      "tag": "forense",
      "location": "Cena do Crime - Warehouse District"
    },
    {
      "id": "clue3",
      "name": "Relato da Testemunha",
      "description": "Sra. Henderson afirma ter visto 'sombras que se moviam contra a luz' na noite do incidente. Está visivelmente traumatizada.",
      "type": "testimony",
      "tag": "testemunha",
      "location": "Residência Henderson"
    }
  ]
}
```

---

## Item (Item de Sessão)

Representa um item obtido durante uma sessão de jogo.

### Interface

```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
}
```

### Propriedades

| Propriedade | Tipo | Descrição | Obrigatório |
|-------------|------|-----------|-------------|
| `id` | string | Identificador único do item | Sim |
| `name` | string | Nome do item | Sim |
| `description` | string | Descrição e efeitos | Sim |
| `type` | string | Tipo do item | Sim |

### Exemplo

```json
{
  "items": [
    {
      "id": "item1",
      "name": "Chave de Bronze Antiga",
      "description": "Chave ornamentada com símbolos que parecem mudar quando não observados diretamente. Propósito desconhecido.",
      "type": "artifact"
    },
    {
      "id": "item2",
      "name": "Grimório de Invocações",
      "description": "Livro de capa de couro contendo rituais. Requer POD 50+ para ler sem risco. Sanidade -1d4, Mitos +3%",
      "type": "book"
    },
    {
      "id": "item3",
      "name": "Pistola do Culpado",
      "description": "Revólver .45 deixado pelo cultista derrotado. Totalmente carregado (7 balas).",
      "type": "weapon"
    }
  ]
}
```

---

## Validações

O sistema utiliza Joi para validação de dados. Aqui estão as regras principais:

### Character Validation

```typescript
const createCharacterSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  occupation: Joi.string().required().min(2).max(100),
  image: Joi.string().uri().required(),
  stats: Joi.object({
    For: Joi.number().min(0).max(100).required(),
    Con: Joi.number().min(0).max(100).required(),
    Tam: Joi.number().min(0).max(100).required(),
    Des: Joi.number().min(0).max(100).required(),
    Apa: Joi.number().min(0).max(100).required(),
    Edu: Joi.number().min(0).max(100).required(),
    Int: Joi.number().min(0).max(100).required(),
    Pod: Joi.number().min(0).max(100).required(),
  }).required(),
  background: Joi.string().required().min(10),
  mentalHealth: Joi.object({
    sanity: Joi.number().min(0).max(99).required(),
    maxSanity: Joi.number().min(0).max(99).required(),
    tempSanity: Joi.boolean().required(),
    indefiniteSanity: Joi.boolean().required(),
    phobias: Joi.array().items(Joi.string()),
    manias: Joi.array().items(Joi.string()),
  }).required(),
  skills: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      value: Joi.number().min(0).max(100).required(),
      category: Joi.string().valid('combat', 'academic', 'pratical', 'social').required(),
    })
  ).required(),
  equipment: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().valid('weapon', 'tool', 'book', 'artifact').required(),
    })
  ).required(),
  pulpTalents: Joi.array().items(Joi.string()).required(),
  wounds: Joi.number().min(0).required(),
  maxHealth: Joi.number().min(1).required(),
});
```

### Session Validation

```typescript
const createSessionSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  date: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/),
  location: Joi.string().required().min(2).max(200),
  summary: Joi.string().required().min(10),
  details: Joi.string().required().min(20),
  tags: Joi.array().items(Joi.string()).required(),
  images: Joi.array().items(Joi.string().uri()),
  clues: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      image: Joi.string().uri().optional(),
      tag: Joi.string().optional(),
      location: Joi.string().optional(),
    })
  ).required(),
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
    })
  ).required(),
});
```

---

## Exemplos Completos

### Criar Personagem Completo

```typescript
const newCharacter = {
  name: "Sarah Blackwood",
  occupation: "Jornalista Investigativa",
  image: "https://example.com/sarah.jpg",
  stats: {
    For: 45,
    Con: 55,
    Tam: 50,
    Des: 65,
    Apa: 70,
    Edu: 65,
    Int: 70,
    Pod: 60
  },
  background: "Sarah é uma jornalista determinada que trabalha para o Arkham Advertiser. Após testemunhar eventos inexplicáveis durante uma investigação, ela se tornou obcecada em descobrir a verdade por trás dos mistérios ocultos de Arkham.",
  mentalHealth: {
    sanity: 60,
    maxSanity: 60,
    tempSanity: false,
    indefiniteSanity: false,
    phobias: [],
    manias: []
  },
  skills: [
    { name: "Charme", value: 65, category: "social" },
    { name: "Lábia", value: 70, category: "social" },
    { name: "Psicologia", value: 50, category: "social" },
    { name: "Fotografia", value: 60, category: "pratical" },
    { name: "Dirigir Auto", value: 50, category: "pratical" },
    { name: "História", value: 55, category: "academic" },
    { name: "Armas de Fogo (Pistola)", value: 35, category: "combat" },
  ],
  equipment: [
    {
      "name": "Câmera Leica",
      "description": "Câmera de alta qualidade para documentação",
      "type": "tool"
    },
    {
      "name": "Caderno de Anotações",
      "description": "Repleto de notas sobre casos anteriores",
      "type": "tool"
    },
    {
      "name": "Pistola .32",
      "description": "Pequena pistola para proteção pessoal",
      "type": "weapon"
    }
  ],
  pulpTalents: [
    "Investigadora Nata (pode fazer um segundo teste em investigações falhas)",
    "Contatos da Imprensa (rede de informantes)"
  ],
  wounds: 0,
  maxHealth: 10
};

const response = await fetch('http://localhost:3000/api/characters', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newCharacter)
});
```

### Criar Sessão Completa

```typescript
const newSession = {
  title: "Capítulo 3: O Ritual no Cais",
  date: "2024-02-10",
  location: "Arkham - Cais Industrial",
  summary: "Os investigadores interrompem um ritual do culto, mas não sem consequências. Descobrem que o culto planeja invocar uma entidade durante o próximo eclipse.",
  details: `A investigação levou os personagens ao cais industrial abandonado às 23h. Sarah usou sua câmera com flash infravermelho para documentar o local.

Thomas detectou movimento e o grupo se escondeu atrás de contêineres. Viram aproximadamente 12 cultistas reunidos em círculo, com um altar improvisado no centro.

Dr. Armitage reconheceu o ritual como uma invocação menor de Nyarlathotep (teste de Mitos de Cthulhu - sucesso). Ele alertou que interromper o ritual agora poderia ser perigoso, mas esperar seria pior.

O grupo decidiu agir. Sarah disparou um tiro de advertência, dispersando alguns cultistas. Um combate breve ocorreu:
- Thomas sofreu 3 pontos de dano de uma faca ritual
- Sarah eliminou um cultista com tiro certeiro (Extremo)
- Dr. Armitage usou um contra-feitiço (Gasto 5 POD)

O ritual foi interrompido, mas não antes de uma aparição temporária - uma massa de tentáculos negros que rapidamente desvaneceu. Todos perderam 1d6 sanidade (Sarah: 4, Thomas: 5, Dr. Armitage: 3).

Recuperaram o livro ritual e documentos revelando que o eclipse de março será usado para uma invocação maior.`,
  tags: ["combate", "ritual", "nyarlathotep", "cais", "urgente"],
  images: [
    "https://example.com/docks-night.jpg",
    "https://example.com/ritual-circle.jpg",
    "https://example.com/tentacle-manifestation.jpg"
  ],
  clues: [
    {
      id: "clue5",
      name: "Livro Ritual do Culto",
      description: "Livro encadernado em couro negro contendo o ritual completo. Inclui data e hora específicas do eclipse.",
      type: "document",
      image: "https://example.com/ritual-book.jpg",
      tag: "ritual",
      location: "Altar - Cais Industrial"
    },
    {
      id: "clue6",
      name: "Mapa Estelar Anotado",
      description: "Mapa mostrando posições planetárias durante o eclipse de março. Anotações em língua desconhecida.",
      type: "document",
      tag: "astronomia",
      location: "Altar - Cais Industrial"
    }
  ],
  items: [
    {
      id: "item4",
      name: "Livro Ritual",
      description: "Pode ser estudado (1 semana, teste INT). Concede feitiço Contato com Nyarlathotep. Sanidade -1d6.",
      type: "book"
    },
    {
      id: "item5",
      name: "Adaga de Prata",
      description: "Arma ritual. 1d4+1 dano, efetiva contra certas criaturas sobrenaturais.",
      type: "weapon"
    }
  ]
};

const response = await fetch('http://localhost:3000/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newSession)
});
```

---

## Relacionamentos

### Character ↔ Session

Embora não haja relacionamento direto no modelo atual, os personagens são mencionados nas sessões através do campo `details`.

**Melhoria Futura:** Adicionar campo `participants` em Session:

```typescript
interface Session {
  // ... outros campos
  participants: {
    characterId: string;
    characterName: string;
    sanityLost: number;
    damageReceived: number;
    notes: string;
  }[];
}
```

### Tags e Filtros

Tags são usadas para criar relacionamentos implícitos:
- Sessões podem ser filtradas por tags
- Clues dentro de sessões têm tags
- Isso permite rastreamento temático da campanha

---

## Considerações de Performance

### Índices MongoDB

Os seguintes índices são recomendados:

```typescript
// Characters
CharacterModel.index({ name: 1 });
CharacterModel.index({ occupation: 1 });
CharacterModel.index({ createdAt: -1 });

// Sessions  
SessionModel.index({ tags: 1 });
SessionModel.index({ date: -1 });
SessionModel.index({ title: 'text', summary: 'text', details: 'text' });
```

### Paginação

Para grandes volumes de dados, implemente paginação:

```typescript
GET /api/sessions?page=1&limit=20
GET /api/characters?page=1&limit=10
```

---

Esta documentação fornece uma visão completa dos modelos de dados utilizados no sistema. Para mais informações sobre como usar esses modelos via API, consulte [API.md](API.md).
