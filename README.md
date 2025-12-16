# 💰 API Finanças

> Sistema completo de gerenciamento financeiro com controle de transações, contas, categorias e usuários.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.22.1-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-red.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## 📋 Índice

- [Descrição](#-descrição)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Rotas da API](#-rotas-da-api)
- [Testes](#-testes)
- [Docker](#-docker)
- [Contato](#-contato)

## 📖 Descrição

A **API Finanças** é uma aplicação RESTful robusta desenvolvida para gerenciamento completo de finanças pessoais. O sistema oferece funcionalidades de controle de transações financeiras, gestão de contas bancárias, categorização de gastos, autenticação de usuários e geração de relatórios analíticos.

### Principais Funcionalidades

- ✅ Autenticação JWT com bcrypt
- ✅ CRUD completo de Usuários
- ✅ Gestão de Contas Bancárias
- ✅ Controle de Transações (Depósitos e Retiradas)
- ✅ Categorização de Gastos
- ✅ Atualização automática de saldo
- ✅ Relatórios por categoria, período e tipo
- ✅ Ranking de gastos por categoria
- ✅ Documentação Swagger
- ✅ Testes unitários completos (56 testes)

## 🏗️ Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Camada de Rotas             │
│  (Express Router + Middleware Auth) │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│       Camada de Controllers          │
│   (Lógica de Negócio e Validação)   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│         Camada de Models             │
│      (Sequelize ORM + MySQL)         │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│        Banco de Dados MySQL          │
└──────────────────────────────────────┘
```

### Fluxo de Autenticação

```
1. Cliente envia credenciais → POST /login
2. Controller valida usuário e senha (bcrypt)
3. Gera token JWT com expiração
4. Cliente recebe token
5. Cliente envia token no header: Authorization: Bearer {token}
6. Middleware valida token antes de acessar rotas protegidas
```

## 🚀 Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | 18.x | Ambiente de execução JavaScript |
| **Express.js** | 4.22.1 | Framework web minimalista |
| **Sequelize** | 6.37.7 | ORM para MySQL |
| **MySQL2** | 3.12.0 | Driver MySQL para Node.js |
| **JWT** | 9.0.3 | Autenticação baseada em tokens |
| **Bcrypt** | 6.0.0 | Hash de senhas |
| **Cors** | 2.8.5 | Controle de acesso entre origens |
| **Dotenv** | 16.4.7 | Gerenciamento de variáveis de ambiente |


### Testes

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Jest** | 29.7.0 | Framework de testes |
| **Supertest** | 7.1.4 | Testes de integração HTTP |
| **@jest/globals** | 29.7.0 | Utilitários globais do Jest |

### DevOps

| Tecnologia | Descrição |
|-----------|-----------|
| **Docker** | Containerização da aplicação |
| **Docker Compose** | Orquestração de containers |
| **Nodemon** | Auto-reload em desenvolvimento |

## 📁 Estrutura do Projeto

```
ApiFInancas/
├── __tests__/                      # Testes unitários
│   ├── middlewares/
│   │   └── authMiddleware.test.js  # Testes do middleware
│   ├── routes/
│   │   ├── auth.test.js            # Testes de autenticação
│   │   ├── user.test.js            # Testes de usuários
│   │   ├── account.test.js         # Testes de contas
│   │   ├── category.test.js        # Testes de categorias
│   │   └── transaction.test.js     # Testes de transações
│   └── README.md                   # Documentação dos testes
│
├── src/
│   ├── config/
│   │   └── sequelize.js            # Configuração do Sequelize
│   │
│   ├── controllers/
│   │   ├── accountController.js    # Lógica de contas
│   │   ├── authController.js       # Lógica de autenticação
│   │   ├── categoryController.js   # Lógica de categorias
│   │   ├── transactionController.js # Lógica de transações
│   │   └── userController.js       # Lógica de usuários
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js       # Middleware de autenticação JWT
│   │
│   ├── models/
│   │   ├── Account.js              # Model de conta
│   │   ├── Category.js             # Model de categoria
│   │   ├── Transaction.js          # Model de transação
│   │   ├── User.js                 # Model de usuário
│   │   └── index.js                # Exportação dos models
│   │
│   └── routes/
│       └── routes.js               # Definição de todas as rotas
│
├── .env                            # Variáveis de ambiente (não versionado)
├── .gitignore                      # Arquivos ignorados pelo Git
├── app.js                          # Configuração do Express
├── docker-compose.yml              # Configuração Docker Compose
├── Dockerfile                      # Imagem Docker da aplicação
├── init.sql                        # Script de inicialização do banco
├── jest.setup.js                   # Configuração do Jest
├── package.json                    # Dependências do projeto
├── README.md                       # Este arquivo
└── server.js                       # Ponto de entrada da aplicação
```

## 💻 Instalação

### Pré-requisitos

- Node.js 18.x ou superior
- MySQL 8.0 ou superior
- npm ou yarn
- Docker e Docker Compose (opcional)

### Instalação Local

1. **Clone o repositório**
```bash
git clone https://github.com/EuAndersonDev/ApiFInancas.git
cd ApiFInancas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**

Crie um banco de dados MySQL:
```sql
CREATE DATABASE financas_db;
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=financas_db
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta_aqui
TOKEN_EXPIRY=1h
```

5. **Execute as migrations** (O Sequelize criará as tabelas automaticamente)

6. **Inicie o servidor**
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3333`

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente de execução | development |
| `DB_HOST` | Host do MySQL | localhost |
| `DB_USER` | Usuário do MySQL | root |
| `DB_PASSWORD` | Senha do MySQL | - |
| `DB_NAME` | Nome do banco | financas_db |
| `DB_PORT` | Porta do MySQL | 3306 |
| `JWT_SECRET` | Chave secreta JWT | - |
| `TOKEN_EXPIRY` | Tempo de expiração do token | 1h |

## 📡 Rotas da API

### 🔓 Rotas Públicas (Sem Autenticação)

#### 1. Registro de Usuário

**POST** `/register`

Cria um novo usuário e uma conta automaticamente.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "initialBalance": 1000.00
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": "uuid-gerado",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "account": {
    "id": "uuid-gerado",
    "balance": 1000.00,
    "user_id": "uuid-do-usuario"
  }
}
```

#### 2. Login

**POST** `/login`

Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔒 Rotas Protegidas (Requerem Autenticação)

> **Importante:** Todas as rotas abaixo requerem o header:
> ```
> Authorization: Bearer {seu-token-jwt}
> ```

---

### 👤 Usuários

#### 3. Listar Todos os Usuários

**GET** `/getAllUsers`

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-12-16T10:00:00.000Z",
    "updatedAt": "2025-12-16T10:00:00.000Z"
  }
]
```

---

### 💳 Contas

#### 4. Criar Conta

**POST** `/addAccount`

**Body:**
```json
{
  "balance": 5000.00,
  "user_id": "uuid-do-usuario"
}
```

**Resposta (201):**
```json
{
  "id": "uuid-gerado",
  "balance": 5000.00,
  "user_id": "uuid-do-usuario",
  "createdAt": "2025-12-16T10:00:00.000Z"
}
```

#### 5. Buscar Conta por ID

**GET** `/getAccountById/:id`

**Resposta (200):**
```json
{
  "id": "uuid-da-conta",
  "balance": 5000.00,
  "user_id": "uuid-do-usuario",
  "User": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

#### 6. Consultar Saldo

**GET** `/balance/:id`

**Resposta (200):**
```json
{
  "balance": 5000.00
}
```

---

### 🏷️ Categorias

#### 7. Criar Categoria

**POST** `/addCategory`

**Body:**
```json
{
  "name": "Alimentação"
}
```

**Resposta (201):**
```json
{
  "id": "uuid-gerado",
  "name": "Alimentação",
  "createdAt": "2025-12-16T10:00:00.000Z"
}
```

#### 8. Listar Todas as Categorias

**GET** `/getAllCategories`

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "name": "Alimentação"
  },
  {
    "id": "uuid",
    "name": "Transporte"
  }
]
```

#### 9. Buscar Categoria por Nome

**GET** `/getCategoryByName`

**Body:**
```json
{
  "name": "Alimentação"
}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "name": "Alimentação"
}
```

#### 10. Ranking de Gastos por Categoria

**GET** `/categorySpendingRanking`

**Body (opcional):**
```json
{
  "user_id": "uuid-do-usuario",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "type": "withdrawal"
}
```

**Resposta (200):**
```json
{
  "filters": {
    "type": "withdrawal",
    "user_id": "uuid-do-usuario",
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-12-31"
    }
  },
  "totalCategories": 3,
  "ranking": [
    {
      "category_id": "uuid",
      "category_name": "Alimentação",
      "totalSpent": 1500.00,
      "transactionCount": 25
    },
    {
      "category_id": "uuid",
      "category_name": "Transporte",
      "totalSpent": 800.00,
      "transactionCount": 15
    }
  ]
}
```

---

### 💸 Transações

#### 11. Adicionar Transação

**POST** `/addTransaction`

**Body (Depósito):**
```json
{
  "description": "Salário",
  "amount": 5000.00,
  "date": "2025-12-16",
  "type": "deposit",
  "user_id": "uuid-do-usuario",
  "account_id": "uuid-da-conta",
  "category_id": "uuid-da-categoria"
}
```

**Body (Retirada):**
```json
{
  "description": "Compra no supermercado",
  "amount": 250.50,
  "date": "2025-12-16",
  "type": "withdrawal",
  "user_id": "uuid-do-usuario",
  "account_id": "uuid-da-conta",
  "category_id": "uuid-da-categoria"
}
```

**Resposta (201):**
```json
{
  "id": "uuid-gerado",
  "description": "Salário",
  "amount": 5000.00,
  "date": "2025-12-16T00:00:00.000Z",
  "type": "deposit",
  "user_id": "uuid",
  "account_id": "uuid",
  "category_id": "uuid",
  "createdAt": "2025-12-16T10:00:00.000Z"
}
```

> **Nota:** O saldo da conta é atualizado automaticamente.

#### 12. Listar Todas as Transações

**GET** `/getAllTransactions`

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "description": "Salário",
    "amount": 5000.00,
    "date": "2025-12-16T00:00:00.000Z",
    "type": "deposit",
    "User": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "Account": {
      "id": "uuid",
      "balance": 5000.00
    },
    "Category": {
      "id": "uuid",
      "name": "Salário"
    }
  }
]
```

#### 13. Buscar Transação por ID

**GET** `/getTransactionById/:id`

**Resposta (200):**
```json
{
  "id": "uuid",
  "description": "Compra no supermercado",
  "amount": 250.50,
  "date": "2025-12-16T00:00:00.000Z",
  "type": "withdrawal",
  "User": { ... },
  "Account": { ... },
  "Category": { ... }
}
```

#### 14. Atualizar Transação

**PUT** `/updateTransaction/:id`

**Body:**
```json
{
  "description": "Compra no mercado - atualizado",
  "amount": 300.00,
  "date": "2025-12-16",
  "type": "withdrawal",
  "user_id": "uuid",
  "account_id": "uuid",
  "category_id": "uuid"
}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "description": "Compra no mercado - atualizado",
  "amount": 300.00,
  ...
}
```

> **Nota:** O saldo da conta é recalculado automaticamente.

#### 15. Deletar Transação

**DELETE** `/deleteTransaction/:id`

**Resposta (200):**
```json
{
  "message": "Transaction deleted successfully"
}
```

> **Nota:** O saldo da conta é revertido automaticamente.

#### 16. Transações por Categoria

**GET** `/transactionsByCategory/:category_id`

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "description": "Almoço",
    "amount": 45.00,
    "type": "withdrawal",
    "date": "2025-12-16T00:00:00.000Z"
  }
]
```

#### 17. Transações por Período

**GET** `/transactionsByPeriod`

**Query Params:**
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `user_id`: ID do usuário (opcional)

**Exemplo:**
```
GET /transactionsByPeriod?startDate=2025-01-01&endDate=2025-12-31&user_id=uuid
```

**Resposta (200):**
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  },
  "totalTransactions": 50,
  "transactions": [ ... ]
}
```

#### 18. Transações por Tipo

**GET** `/transactionsByType`

**Query Params:**
- `type`: "deposit" ou "withdrawal"
- `user_id`: ID do usuário (opcional)

**Exemplo:**
```
GET /transactionsByType?type=deposit&user_id=uuid
```

**Resposta (200):**
```json
{
  "type": "deposit",
  "totalTransactions": 12,
  "totalAmount": 15000.00,
  "transactions": [ ... ]
}
```

---

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autorizado (token inválido ou ausente) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários com **81.33% de cobertura**.

### Executar Testes

```bash
# Executar todos os testes com cobertura
npm test

# Modo watch (desenvolvimento)
npm run test:watch
```

### Cobertura de Testes

- ✅ 56 testes passando
- ✅ 6 suítes de teste
- ✅ Testes de autenticação
- ✅ Testes de todas as rotas
- ✅ Testes de middleware
- ✅ Testes de validação

Para mais detalhes, consulte o [README dos testes](./__tests__/README.md).

---

## 🐳 Docker

### Executar com Docker Compose

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

A aplicação estará disponível em `http://localhost:3000`
O MySQL estará disponível na porta `3307`

---

## 📚 Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença ISC.

---

## 👨‍💻 Contato

**Anderson Reis**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anderson-reis-5407311b3/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EuAndersonDev)

---

<p align="center">
  Desenvolvido com ❤️ por Anderson Reis
</p>

