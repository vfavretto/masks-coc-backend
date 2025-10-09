# Exemplos de Uso e Casos de Teste

Este documento fornece exemplos práticos de uso da API, casos de teste e cenários comuns de integração.

## Índice

- [Exemplos Básicos](#exemplos-básicos)
- [Exemplos Avançados](#exemplos-avançados)
- [Integração com Frontend](#integração-com-frontend)
- [Scripts de Automação](#scripts-de-automação)
- [Casos de Teste](#casos-de-teste)
- [Cenários Reais de RPG](#cenários-reais-de-rpg)
- [Troubleshooting](#troubleshooting)

---

## Exemplos Básicos

### 1. Criar e Gerenciar Personagem

#### JavaScript/TypeScript

```javascript
// Configuração inicial
const API_BASE_URL = 'http://localhost:3000/api';

// Criar novo personagem
async function criarPersonagem() {
  const novoPersonagem = {
    name: "Dr. Marcus Holloway",
    occupation: "Médico Psiquiatra",
    image: "https://example.com/marcus.jpg",
    stats: {
      For: 55,
      Con: 60,
      Tam: 65,
      Des: 50,
      Apa: 60,
      Edu: 75,
      Int: 80,
      Pod: 70
    },
    background: "Psiquiatra renomado especializado em traumas. Começou a investigar o sobrenatural após tratar pacientes com experiências inexplicáveis.",
    mentalHealth: {
      sanity: 70,
      maxSanity: 70,
      tempSanity: false,
      indefiniteSanity: false,
      phobias: [],
      manias: []
    },
    skills: [
      { name: "Medicina", value: 70, category: "academic" },
      { name: "Psicologia", value: 75, category: "social" },
      { name: "Psicanálise", value: 65, category: "academic" },
      { name: "Persuasão", value: 60, category: "social" }
    ],
    equipment: [
      {
        name: "Maleta Médica",
        description: "Contém instrumentos médicos e medicamentos básicos",
        type: "tool"
      },
      {
        name: "Gravador de Voz",
        description: "Para gravar sessões de terapia",
        type: "tool"
      }
    ],
    pulpTalents: ["Análise Rápida (bônus em Psicologia)"],
    wounds: 0,
    maxHealth: 12
  };

  try {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoPersonagem),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const personagemCriado = await response.json();
    console.log('Personagem criado:', personagemCriado);
    return personagemCriado;
  } catch (error) {
    console.error('Erro ao criar personagem:', error);
    throw error;
  }
}

// Atualizar saúde mental após evento traumático
async function atualizarSaúdeMental(characterId, sanidadePerdida) {
  // Buscar personagem atual
  const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
  const personagem = await response.json();

  // Calcular nova sanidade
  const novaSanidade = Math.max(0, personagem.mentalHealth.sanity - sanidadePerdida);
  
  // Determinar se há insanidade temporária (perdeu 5+ de uma vez)
  const insanidadeTemp = sanidadePerdida >= 5;

  // Atualizar
  const atualizacao = {
    mentalHealth: {
      ...personagem.mentalHealth,
      sanity: novaSanidade,
      tempSanity: insanidadeTemp || personagem.mentalHealth.tempSanity
    }
  };

  const updateResponse = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atualizacao),
  });

  return updateResponse.json();
}

// Adicionar fobia após teste de sanidade falhado
async function adicionarFobia(characterId, fobia) {
  const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
  const personagem = await response.json();

  const atualizacao = {
    mentalHealth: {
      ...personagem.mentalHealth,
      phobias: [...personagem.mentalHealth.phobias, fobia]
    }
  };

  const updateResponse = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atualizacao),
  });

  return updateResponse.json();
}

// Aplicar dano
async function aplicarDano(characterId, dano) {
  const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
  const personagem = await response.json();

  const novosFerrimentos = Math.min(
    personagem.maxHealth, 
    personagem.wounds + dano
  );

  const updateResponse = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wounds: novosFerrimentos }),
  });

  return updateResponse.json();
}
```

#### Python

```python
import requests
from typing import Dict, List, Optional

class RPGCharacterManager:
    def __init__(self, base_url: str = "http://localhost:3000/api"):
        self.base_url = base_url
    
    def criar_personagem(self, dados: Dict) -> Dict:
        """Cria um novo personagem"""
        response = requests.post(
            f"{self.base_url}/characters",
            json=dados
        )
        response.raise_for_status()
        return response.json()
    
    def atualizar_sanidade(self, character_id: str, perda: int) -> Dict:
        """Atualiza sanidade após evento traumático"""
        # Buscar personagem
        char = requests.get(f"{self.base_url}/characters/{character_id}").json()
        
        # Calcular nova sanidade
        nova_sanidade = max(0, char['mentalHealth']['sanity'] - perda)
        insanidade_temp = perda >= 5
        
        # Atualizar
        atualizacao = {
            'mentalHealth': {
                **char['mentalHealth'],
                'sanity': nova_sanidade,
                'tempSanity': insanidade_temp or char['mentalHealth']['tempSanity']
            }
        }
        
        response = requests.put(
            f"{self.base_url}/characters/{character_id}",
            json=atualizacao
        )
        response.raise_for_status()
        return response.json()
    
    def adicionar_fobia(self, character_id: str, fobia: str) -> Dict:
        """Adiciona uma fobia ao personagem"""
        char = requests.get(f"{self.base_url}/characters/{character_id}").json()
        
        atualizacao = {
            'mentalHealth': {
                **char['mentalHealth'],
                'phobias': [*char['mentalHealth']['phobias'], fobia]
            }
        }
        
        response = requests.put(
            f"{self.base_url}/characters/{character_id}",
            json=atualizacao
        )
        response.raise_for_status()
        return response.json()
    
    def aplicar_dano(self, character_id: str, dano: int) -> Dict:
        """Aplica dano ao personagem"""
        char = requests.get(f"{self.base_url}/characters/{character_id}").json()
        
        novos_ferimentos = min(char['maxHealth'], char['wounds'] + dano)
        
        response = requests.put(
            f"{self.base_url}/characters/{character_id}",
            json={'wounds': novos_ferimentos}
        )
        response.raise_for_status()
        return response.json()

# Uso
manager = RPGCharacterManager()

# Criar personagem
novo_char = manager.criar_personagem({
    "name": "Dr. Marcus Holloway",
    "occupation": "Médico Psiquiatra",
    # ... resto dos dados
})

# Aplicar dano após combate
manager.aplicar_dano(novo_char['id'], 3)

# Perder sanidade após ver criatura
manager.atualizar_sanidade(novo_char['id'], 6)

# Adicionar fobia
manager.adicionar_fobia(novo_char['id'], "Medo de Profundezas Oceânicas")
```

### 2. Gerenciar Sessões de Jogo

#### JavaScript/TypeScript

```javascript
// Criar sessão após jogo
async function registrarSessao(dadosSessao) {
  const novaSessao = {
    title: "Capítulo 5: O Segredo de Innsmouth",
    date: "2024-02-15",
    location: "Innsmouth, Massachusetts",
    summary: "Os investigadores chegam a Innsmouth e descobrem a verdade perturbadora sobre os habitantes da cidade.",
    details: `A sessão começou com os investigadores chegando a Innsmouth de ônibus...
    
    [EVENTO 1: Chegada]
    - Atmosfera opressiva e habitantes hostis
    - Hotel Gilman - único lugar para ficar
    - Barman fornece informações sobre a Ordem Esotérica de Dagon
    
    [EVENTO 2: Investigação Noturna]
    - Dr. Holloway investiga o cais (teste Furtividade - sucesso)
    - Testemunhou ritual de Deep Ones
    - Perda de 1d8 sanidade (rolou 6)
    
    [EVENTO 3: Fuga]
    - Perseguição pelos Deep Ones
    - Combate no cais (todos feridos)
    - Fuga de carro para Arkham`,
    tags: ["innsmouth", "deep-ones", "investigação", "combate", "fuga"],
    images: [
      "https://example.com/innsmouth-town.jpg",
      "https://example.com/gilman-hotel.jpg",
      "https://example.com/deep-ones-ritual.jpg"
    ],
    clues: [
      {
        id: "clue7",
        name: "Panfleto da Ordem de Dagon",
        description: "Panfleto religioso descrevendo rituais de adoração a Dagon e Hydra",
        type: "document",
        tag: "religião",
        location: "Hotel Gilman"
      },
      {
        id: "clue8",
        name: "Foto de Ritual",
        description: "Dr. Holloway conseguiu fotografar o ritual noturno antes de fugir",
        type: "physical",
        image: "https://example.com/ritual-photo.jpg",
        tag: "evidência",
        location: "Cais de Innsmouth"
      }
    ],
    items: [
      {
        id: "item6",
        name: "Tiara de Ouro Estranha",
        description: "Tiara com símbolos aquáticos. Parece valiosa mas causa desconforto ao segurar.",
        type: "artifact"
      }
    ]
  };

  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaSessao),
  });

  return response.json();
}

// Buscar todas as sessões com tag específica
async function buscarSessoesPorTag(tag) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/tags?tags=${encodeURIComponent(tag)}`
  );
  return response.json();
}

// Buscar sessões relacionadas a um local
async function buscarPorLocal(termo) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/search?term=${encodeURIComponent(termo)}`
  );
  return response.json();
}

// Adicionar pista a sessão existente
async function adicionarPista(sessionId, novaPista) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
  const sessao = await response.json();

  const atualizacao = {
    clues: [...sessao.clues, novaPista]
  };

  const updateResponse = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atualizacao),
  });

  return updateResponse.json();
}
```

---

## Exemplos Avançados

### 1. Sistema de Gerenciamento de Campanha

```javascript
class CampaignManager {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Criar campanha completa com personagens e sessão inicial
  async iniciarNovaCampanha(nomeCampanha, personagens, sessaoInicial) {
    const results = {
      campaign: nomeCampanha,
      characters: [],
      session: null
    };

    // Criar todos os personagens
    for (const personagemData of personagens) {
      const response = await fetch(`${this.apiBaseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personagemData),
      });
      results.characters.push(await response.json());
    }

    // Criar sessão inicial
    const sessionResponse = await fetch(`${this.apiBaseUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessaoInicial),
    });
    results.session = await sessionResponse.json();

    return results;
  }

  // Finalizar sessão: atualizar todos os personagens
  async finalizarSessao(sessionId, atualizacoesPersonagens) {
    const updates = [];

    for (const [characterId, mudancas] of Object.entries(atualizacoesPersonagens)) {
      const response = await fetch(`${this.apiBaseUrl}/characters/${characterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mudancas),
      });
      updates.push(await response.json());
    }

    return updates;
  }

  // Gerar resumo da campanha
  async gerarResumoCampanha(tags) {
    const sessoes = await fetch(
      `${this.apiBaseUrl}/sessions/tags?${tags.map(t => `tags=${t}`).join('&')}`
    ).then(r => r.json());

    const personagens = await fetch(
      `${this.apiBaseUrl}/characters`
    ).then(r => r.json());

    return {
      totalSessoes: sessoes.length,
      personagens: personagens.map(p => ({
        nome: p.name,
        sanidade: `${p.mentalHealth.sanity}/${p.mentalHealth.maxSanity}`,
        ferimentos: `${p.wounds}/${p.maxHealth}`,
        status: this.calcularStatus(p)
      })),
      pistasColetadas: sessoes.reduce((acc, s) => acc + s.clues.length, 0),
      locaisVisitados: [...new Set(sessoes.map(s => s.location))]
    };
  }

  calcularStatus(personagem) {
    const percSanidade = (personagem.mentalHealth.sanity / personagem.mentalHealth.maxSanity) * 100;
    const percVida = ((personagem.maxHealth - personagem.wounds) / personagem.maxHealth) * 100;

    if (percSanidade < 30 || percVida < 30) return '🔴 Crítico';
    if (percSanidade < 60 || percVida < 60) return '🟡 Ferido';
    return '🟢 Saudável';
  }
}

// Uso
const manager = new CampaignManager('http://localhost:3000/api');

// Iniciar campanha
const campanha = await manager.iniciarNovaCampanha(
  "Masks of Nyarlathotep",
  [
    { /* dados personagem 1 */ },
    { /* dados personagem 2 */ },
    { /* dados personagem 3 */ }
  ],
  { /* dados sessão inicial */ }
);

// Após sessão, atualizar personagens
await manager.finalizarSessao(campanha.session.id, {
  [campanha.characters[0].id]: {
    wounds: 2,
    mentalHealth: { ...campanha.characters[0].mentalHealth, sanity: 55 }
  },
  [campanha.characters[1].id]: {
    wounds: 0,
    mentalHealth: { ...campanha.characters[1].mentalHealth, sanity: 60 }
  }
});

// Gerar resumo
const resumo = await manager.gerarResumoCampanha(['masks', 'nyarlathotep']);
console.log(resumo);
```

### 2. Rastreador de Pistas e Conexões

```javascript
class ClueTracker {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Buscar todas as pistas por tag
  async buscarPistasPorTag(tag) {
    const sessoes = await fetch(`${this.apiBaseUrl}/sessions`).then(r => r.json());
    
    const pistas = [];
    for (const sessao of sessoes) {
      for (const pista of sessao.clues) {
        if (pista.tag === tag) {
          pistas.push({
            ...pista,
            sessao: sessao.title,
            data: sessao.date
          });
        }
      }
    }
    
    return pistas;
  }

  // Encontrar conexões entre pistas
  async encontrarConexoes(termo) {
    const sessoes = await fetch(
      `${this.apiBaseUrl}/sessions/search?term=${encodeURIComponent(termo)}`
    ).then(r => r.json());

    const conexoes = sessoes.map(sessao => ({
      sessao: sessao.title,
      data: sessao.date,
      local: sessao.location,
      pistas: sessao.clues.filter(p => 
        p.name.toLowerCase().includes(termo.toLowerCase()) ||
        p.description.toLowerCase().includes(termo.toLowerCase())
      ),
      relevancia: sessao.summary.toLowerCase().includes(termo.toLowerCase()) ? 'Alta' : 'Média'
    }));

    return conexoes.filter(c => c.pistas.length > 0);
  }

  // Mapear progressão da investigação
  async mapearProgressao() {
    const sessoes = await fetch(`${this.apiBaseUrl}/sessions`).then(r => r.json());
    
    // Ordenar por data
    sessoes.sort((a, b) => new Date(a.date) - new Date(b.date));

    const timeline = sessoes.map(sessao => ({
      data: sessao.date,
      titulo: sessao.title,
      local: sessao.location,
      pistasTotais: sessao.clues.length,
      pistasChave: sessao.clues.filter(p => p.tag === 'chave').length,
      tags: sessao.tags
    }));

    return {
      timeline,
      totalPistas: sessoes.reduce((acc, s) => acc + s.clues.length, 0),
      locaisVisitados: [...new Set(sessoes.map(s => s.location))].length,
      duracaoCampanha: this.calcularDuracao(sessoes[0].date, sessoes[sessoes.length - 1].date)
    };
  }

  calcularDuracao(inicio, fim) {
    const diff = new Date(fim) - new Date(inicio);
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${dias} dias`;
  }
}

// Uso
const tracker = new ClueTracker('http://localhost:3000/api');

// Buscar pistas sobre Nyarlathotep
const pistasNyar = await tracker.buscarPistasPorTag('nyarlathotep');
console.log('Pistas sobre Nyarlathotep:', pistasNyar);

// Encontrar conexões com "culto"
const conexoesCulto = await tracker.encontrarConexoes('culto');
console.log('Conexões encontradas:', conexoesCulto);

// Mapear progressão
const progressao = await tracker.mapearProgressao();
console.log('Progressão da campanha:', progressao);
```

---

## Integração com Frontend

### React/Next.js

```typescript
// hooks/useCharacters.ts
import { useState, useEffect } from 'react';

interface Character {
  id: string;
  name: string;
  // ... outros campos
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/characters');
      if (!response.ok) throw new Error('Erro ao buscar personagens');
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (data: Partial<Character>) => {
    const response = await fetch('http://localhost:3000/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const newChar = await response.json();
    setCharacters([...characters, newChar]);
    return newChar;
  };

  const updateCharacter = async (id: string, data: Partial<Character>) => {
    const response = await fetch(`http://localhost:3000/api/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await response.json();
    setCharacters(characters.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCharacter = async (id: string) => {
    await fetch(`http://localhost:3000/api/characters/${id}`, {
      method: 'DELETE',
    });
    setCharacters(characters.filter(c => c.id !== id));
  };

  return {
    characters,
    loading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refetch: fetchCharacters,
  };
}

// Componente
function CharacterList() {
  const { characters, loading, updateCharacter } = useCharacters();

  const handleDamage = async (characterId: string, damage: number) => {
    const char = characters.find(c => c.id === characterId);
    if (!char) return;

    await updateCharacter(characterId, {
      wounds: Math.min(char.maxHealth, char.wounds + damage)
    });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {characters.map(char => (
        <div key={char.id}>
          <h3>{char.name}</h3>
          <p>Vida: {char.maxHealth - char.wounds}/{char.maxHealth}</p>
          <p>Sanidade: {char.mentalHealth.sanity}/{char.mentalHealth.maxSanity}</p>
          <button onClick={() => handleDamage(char.id, 1)}>Aplicar Dano</button>
        </div>
      ))}
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div>
    <h2>Personagens</h2>
    <div v-if="loading">Carregando...</div>
    <div v-else>
      <div v-for="char in characters" :key="char.id" class="character-card">
        <h3>{{ char.name }}</h3>
        <p>Ocupação: {{ char.occupation }}</p>
        <div class="stats">
          <span>Vida: {{ char.maxHealth - char.wounds }}/{{ char.maxHealth }}</span>
          <span>Sanidade: {{ char.mentalHealth.sanity }}/{{ char.mentalHealth.maxSanity }}</span>
        </div>
        <button @click="aplicarDano(char.id, 1)">Aplicar Dano</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const characters = ref([]);
    const loading = ref(true);

    const fetchCharacters = async () => {
      const response = await fetch('http://localhost:3000/api/characters');
      characters.value = await response.json();
      loading.value = false;
    };

    const aplicarDano = async (id, dano) => {
      const char = characters.value.find(c => c.id === id);
      const novosFerrimentos = Math.min(char.maxHealth, char.wounds + dano);

      await fetch(`http://localhost:3000/api/characters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wounds: novosFerrimentos }),
      });

      await fetchCharacters();
    };

    onMounted(fetchCharacters);

    return {
      characters,
      loading,
      aplicarDano,
    };
  },
};
</script>
```

---

## Scripts de Automação

### Script de Backup

```javascript
// scripts/backup.js
const fs = require('fs');
const path = require('path');

async function backupData() {
  const API_URL = 'http://localhost:3000/api';
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(__dirname, '../backups', timestamp);

  // Criar diretório
  fs.mkdirSync(backupDir, { recursive: true });

  // Backup personagens
  const characters = await fetch(`${API_URL}/characters`).then(r => r.json());
  fs.writeFileSync(
    path.join(backupDir, 'characters.json'),
    JSON.stringify(characters, null, 2)
  );

  // Backup sessões
  const sessions = await fetch(`${API_URL}/sessions`).then(r => r.json());
  fs.writeFileSync(
    path.join(backupDir, 'sessions.json'),
    JSON.stringify(sessions, null, 2)
  );

  console.log(`✅ Backup criado em: ${backupDir}`);
}

backupData().catch(console.error);
```

### Script de Importação

```javascript
// scripts/import.js
const fs = require('fs');

async function importData(backupPath) {
  const API_URL = 'http://localhost:3000/api';

  // Importar personagens
  const characters = JSON.parse(
    fs.readFileSync(`${backupPath}/characters.json`, 'utf-8')
  );

  for (const char of characters) {
    const { id, createdAt, updatedAt, ...data } = char;
    await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Importar sessões
  const sessions = JSON.parse(
    fs.readFileSync(`${backupPath}/sessions.json`, 'utf-8')
  );

  for (const session of sessions) {
    const { id, createdAt, updatedAt, ...data } = session;
    await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  console.log('✅ Dados importados com sucesso!');
}

const backupPath = process.argv[2];
if (!backupPath) {
  console.error('❌ Forneça o caminho do backup');
  process.exit(1);
}

importData(backupPath).catch(console.error);
```

---

## Casos de Teste

### Testes de Unidade (Jest)

```typescript
// __tests__/character.service.test.ts
import { CreateCharacterUseCase } from '../application/useCases/character/CreateCharacter';
import { CharacterRepository } from '../domain/repositories/CharacterRepository';

describe('CreateCharacterUseCase', () => {
  let useCase: CreateCharacterUseCase;
  let mockRepository: jest.Mocked<CharacterRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateCharacterUseCase(mockRepository);
  });

  it('deve criar um personagem com sucesso', async () => {
    const characterData = {
      name: 'Test Character',
      occupation: 'Investigator',
      // ... outros dados necessários
    };

    const expectedCharacter = {
      id: '123',
      ...characterData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.create.mockResolvedValue(expectedCharacter);

    const result = await useCase.execute(characterData);

    expect(result).toEqual(expectedCharacter);
    expect(mockRepository.create).toHaveBeenCalledWith(characterData);
  });
});
```

### Testes de Integração

```typescript
// __tests__/integration/character.api.test.ts
import request from 'supertest';
import { createApp } from '../../infrastructure/web/app';
import { connectDatabase, disconnectDatabase } from '../../infrastructure/database/config';

describe('Character API Integration', () => {
  let app;

  beforeAll(async () => {
    await connectDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/characters', () => {
    it('deve criar um personagem válido', async () => {
      const characterData = {
        name: 'Dr. Test',
        occupation: 'Doctor',
        image: 'https://example.com/image.jpg',
        stats: {
          For: 50, Con: 60, Tam: 55, Des: 45,
          Apa: 50, Edu: 80, Int: 75, Pod: 65
        },
        background: 'Test background',
        mentalHealth: {
          sanity: 65,
          maxSanity: 65,
          tempSanity: false,
          indefiniteSanity: false,
          phobias: [],
          manias: []
        },
        skills: [],
        equipment: [],
        pulpTalents: [],
        wounds: 0,
        maxHealth: 11
      };

      const response = await request(app)
        .post('/api/characters')
        .send(characterData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(characterData.name);
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const invalidData = {
        name: 'A', // muito curto
      };

      await request(app)
        .post('/api/characters')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/characters', () => {
    it('deve retornar lista de personagens', async () => {
      const response = await request(app)
        .get('/api/characters')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
```

---

## Cenários Reais de RPG

### Cenário 1: Combate com Cultistas

```javascript
async function resolverCombate(investigadores, cultistas) {
  const API_URL = 'http://localhost:3000/api';
  const resultados = [];

  for (const inv of investigadores) {
    // Buscar personagem
    const char = await fetch(`${API_URL}/characters/${inv.id}`).then(r => r.json());

    // Simular dano
    const danoRecebido = Math.floor(Math.random() * 6) + 1; // 1d6
    
    // Aplicar dano
    await fetch(`${API_URL}/characters/${inv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wounds: Math.min(char.maxHealth, char.wounds + danoRecebido)
      }),
    });

    resultados.push({
      nome: char.name,
      dano: danoRecebido,
      vida: `${char.maxHealth - (char.wounds + danoRecebido)}/${char.maxHealth}`
    });
  }

  return resultados;
}
```

### Cenário 2: Encontro com Entidade Lovecraftiana

```javascript
async function encontroComEntidade(personagensIds, perdaSanidade) {
  const API_URL = 'http://localhost:3000/api';
  const resultados = [];

  for (const charId of personagensIds) {
    const char = await fetch(`${API_URL}/characters/${charId}`).then(r => r.json());

    // Calcular perda de sanidade (ex: 1d10)
    const perda = Math.floor(Math.random() * 10) + 1;
    const novaSanidade = Math.max(0, char.mentalHealth.sanity - perda);

    // Verificar insanidade temporária
    const insanTemp = perda >= 5;
    
    // Gerar fobia se perdeu 5+ sanidade
    let novaFobia = null;
    if (insanTemp) {
      const fobias = [
        'Medo de Tentáculos',
        'Medo de Escuridão Profunda',
        'Pavor de Água',
        'Medo de Símbolos Estranhos'
      ];
      novaFobia = fobias[Math.floor(Math.random() * fobias.length)];
    }

    // Atualizar personagem
    const atualizacao = {
      mentalHealth: {
        ...char.mentalHealth,
        sanity: novaSanidade,
        tempSanity: insanTemp || char.mentalHealth.tempSanity,
        phobias: novaFobia 
          ? [...char.mentalHealth.phobias, novaFobia]
          : char.mentalHealth.phobias
      }
    };

    await fetch(`${API_URL}/characters/${charId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizacao),
    });

    resultados.push({
      nome: char.name,
      perdaSanidade: perda,
      sanidadeAtual: `${novaSanidade}/${char.mentalHealth.maxSanity}`,
      insanidadeTemp: insanTemp,
      novaFobia: novaFobia
    });
  }

  return resultados;
}
```

---

## Troubleshooting

### Problema: Erro 400 ao criar personagem

**Solução:**
```javascript
// Verificar validação
const dados = { /* ... */ };

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    console.error('Erro de validação:', erro);
    // Verificar campos obrigatórios
  }
} catch (error) {
  console.error('Erro:', error);
}
```

### Problema: Personagem não atualiza

**Solução:**
```javascript
// Verificar se está enviando ID correto
async function atualizarPersonagem(id, mudancas) {
  console.log('Atualizando personagem:', id);
  console.log('Mudanças:', mudancas);

  const response = await fetch(`${API_URL}/characters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mudancas),
  });

  if (!response.ok) {
    console.error('Erro na atualização:', await response.text());
  }

  return response.json();
}
```

### Problema: CORS ao acessar de frontend

**Solução:**
Configure CORS no backend ou use proxy:

```javascript
// No frontend (development)
const API_URL = process.env.NODE_ENV === 'development'
  ? '/api' // usa proxy
  : 'http://localhost:3000/api';
```

---

## Recursos Adicionais

- [Documentação da API](API.md)
- [Modelos de Dados](MODELS.md)
- [Arquitetura](ARCHITECTURE.md)

---

Estes exemplos cobrem os casos de uso mais comuns. Para cenários específicos, consulte a documentação da API ou abra uma issue no repositório.
