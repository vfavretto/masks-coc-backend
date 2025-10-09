# Documentação do RPG Campaign Backend

Bem-vindo à documentação completa do sistema de gerenciamento de campanhas de RPG Call of Cthulhu!

## 📚 Índice de Documentação

### 📖 Documentos Principais

1. **[README Principal](../README.md)**
   - Visão geral do projeto
   - Instalação e configuração
   - Guia de início rápido
   - Scripts disponíveis

2. **[Documentação da API](API.md)**
   - Endpoints completos
   - Exemplos de requisições
   - Códigos de resposta
   - Modelos de dados da API
   - Integração com diferentes linguagens

3. **[Modelos de Dados](MODELS.md)**
   - Estrutura completa de todas as entidades
   - Character (Personagem)
   - Session (Sessão)
   - Tipos auxiliares (Stats, Skills, Equipment, etc.)
   - Validações e regras de negócio

4. **[Arquitetura](ARCHITECTURE.md)**
   - Clean Architecture
   - Estrutura de camadas
   - Fluxo de dados
   - Princípios SOLID
   - Padrões de projeto
   - Inversão de dependência

5. **[Exemplos de Uso](EXAMPLES.md)**
   - Exemplos básicos e avançados
   - Integração com frontend (React, Vue)
   - Scripts de automação
   - Casos de teste
   - Cenários reais de RPG
   - Troubleshooting

---

## 🎯 Guia de Navegação

### Para Iniciantes

Se você está começando com este projeto, recomendamos seguir esta ordem:

1. 📘 [README Principal](../README.md) - Entenda o que é o projeto
2. ⚙️ [Seção de Instalação](../README.md#-instalação) - Configure seu ambiente
3. 🚀 [Guia de Uso](../README.md#-uso) - Execute o servidor
4. 📚 [Documentação da API](API.md) - Aprenda os endpoints básicos
5. 💡 [Exemplos Básicos](EXAMPLES.md#exemplos-básicos) - Veja código em ação

### Para Desenvolvedores

Se você vai contribuir ou modificar o código:

1. 🏗️ [Arquitetura](ARCHITECTURE.md) - Entenda a estrutura do projeto
2. 📊 [Modelos de Dados](MODELS.md) - Conheça as entidades
3. 🔧 [Desenvolvimento](../README.md#-desenvolvimento) - Padrões de código
4. 🧪 [Casos de Teste](EXAMPLES.md#casos-de-teste) - Aprenda a testar
5. 📝 [Expansão](ARCHITECTURE.md#expansão-e-manutenção) - Como adicionar features

### Para Usuários da API

Se você só vai consumir a API:

1. 📚 [Documentação da API](API.md) - Referência completa
2. 💡 [Exemplos de Uso](EXAMPLES.md) - Código pronto para usar
3. 🔄 [Integração Frontend](EXAMPLES.md#integração-com-frontend) - React, Vue, etc.
4. 📊 [Modelos de Dados](MODELS.md) - Estrutura dos dados

---

## 📋 Resumo Rápido

### O que é este projeto?

Backend REST API para gerenciar campanhas de RPG Call of Cthulhu, incluindo:
- ✅ Gerenciamento de personagens (atributos, perícias, sanidade)
- ✅ Registro de sessões de jogo
- ✅ Rastreamento de pistas e itens
- ✅ Sistema de busca e filtros

### Tecnologias Principais

- **Backend:** Node.js + TypeScript + Express
- **Banco de Dados:** MongoDB + Mongoose
- **Arquitetura:** Clean Architecture
- **Validação:** Joi

### Endpoints Principais

```bash
# Personagens
GET    /api/characters          # Lista todos
GET    /api/characters/:id      # Busca por ID
POST   /api/characters          # Cria novo
PUT    /api/characters/:id      # Atualiza
DELETE /api/characters/:id      # Remove

# Sessões
GET    /api/sessions            # Lista todas
GET    /api/sessions/:id        # Busca por ID
GET    /api/sessions/search     # Busca por termo
GET    /api/sessions/tags       # Filtra por tags
POST   /api/sessions            # Cria nova
PUT    /api/sessions/:id        # Atualiza
DELETE /api/sessions/:id        # Remove
```

### Exemplo Rápido

```javascript
// Buscar todos os personagens
const response = await fetch('http://localhost:3000/api/characters');
const characters = await response.json();

// Criar novo personagem
const newChar = await fetch('http://localhost:3000/api/characters', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Dr. Armitage",
    occupation: "Professor",
    // ... outros campos
  }),
});
```

---

## 🗂️ Estrutura da Documentação

```
docs/
├── README.md           # Este arquivo - Índice geral
├── API.md             # Documentação completa da API REST
├── MODELS.md          # Modelos de dados e entidades
├── ARCHITECTURE.md    # Guia de arquitetura e estrutura
└── EXAMPLES.md        # Exemplos de uso e casos de teste
```

---

## 🔍 Busca Rápida

### Preciso de...

| Preciso de... | Veja... |
|---------------|---------|
| Instalar o projeto | [README - Instalação](../README.md#-instalação) |
| Entender os endpoints | [API.md](API.md) |
| Ver exemplos de código | [EXAMPLES.md](EXAMPLES.md) |
| Entender a estrutura | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Conhecer os modelos | [MODELS.md](MODELS.md) |
| Criar um personagem | [API - Character](API.md#criar-novo-personagem) |
| Registrar uma sessão | [API - Session](API.md#criar-nova-sessão) |
| Integrar com React | [EXAMPLES - React](EXAMPLES.md#reactnextjs) |
| Testar a API | [EXAMPLES - Testes](EXAMPLES.md#casos-de-teste) |
| Adicionar feature | [ARCHITECTURE - Expansão](ARCHITECTURE.md#expansão-e-manutenção) |
| Trocar banco de dados | [ARCHITECTURE - Trocar BD](ARCHITECTURE.md#trocar-banco-de-dados) |

---

## 📖 Glossário

### Termos do Call of Cthulhu

- **Sanidade** - Medida da saúde mental do personagem (0-99)
- **Insanidade Temporária** - Loucura breve após perder 5+ pontos de sanidade
- **Insanidade Indefinida** - Loucura prolongada
- **Fobia** - Medo irracional adquirido após trauma
- **Mania** - Comportamento compulsivo
- **Pontos de Vida** - Calculados como (CON + TAM) / 10
- **Atributos** - FOR, CON, TAM, DES, APA, EDU, INT, POD
- **Perícias** - Habilidades do personagem (0-100%)
- **Pulp Talents** - Habilidades especiais (modo Pulp Cthulhu)

### Termos Técnicos

- **DTO** - Data Transfer Object
- **Use Case** - Caso de uso, ação específica do sistema
- **Repository** - Padrão que abstrai acesso a dados
- **Entity** - Entidade de domínio
- **Clean Architecture** - Arquitetura em camadas
- **SOLID** - Princípios de design orientado a objetos

---

## 🆘 Suporte

### Encontrou um problema?

1. Verifique o [Troubleshooting](EXAMPLES.md#troubleshooting)
2. Consulte a [Documentação da API](API.md)
3. Revise os [Exemplos](EXAMPLES.md)
4. Abra uma issue no GitHub

### Quer contribuir?

1. Leia o [Guia de Arquitetura](ARCHITECTURE.md)
2. Veja [Como Contribuir](../README.md#-contribuindo)
3. Siga os [Padrões de Código](ARCHITECTURE.md#boas-práticas)

---

## 📝 Changelog

### Versão 1.0.0 (Atual)

**Recursos:**
- ✅ CRUD completo de Personagens
- ✅ CRUD completo de Sessões
- ✅ Sistema de busca e filtros
- ✅ Validação com Joi
- ✅ Clean Architecture
- ✅ Documentação completa

**Documentação:**
- ✅ API.md - Documentação da API
- ✅ MODELS.md - Modelos de dados
- ✅ ARCHITECTURE.md - Guia de arquitetura
- ✅ EXAMPLES.md - Exemplos e casos de teste
- ✅ README.md - Documentação principal

---

## 🔗 Links Úteis

### Documentação do Projeto

- [README Principal](../README.md)
- [API Reference](API.md)
- [Data Models](MODELS.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Examples & Tests](EXAMPLES.md)

### Recursos Externos

- [Call of Cthulhu RPG](https://www.chaosium.com/call-of-cthulhu-rpg/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/)

---

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para mestres e jogadores de Call of Cthulhu**

*Última atualização: 2024*
