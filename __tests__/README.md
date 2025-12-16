# Testes Unitários - API Financas

Este projeto contém testes unitários completos para todas as rotas da API.

## Estrutura dos Testes

```
__tests__/
├── setup.js                          # Configuração global dos testes
├── middlewares/
│   └── authMiddleware.test.js        # Testes do middleware de autenticação
└── routes/
    ├── auth.test.js                  # Testes das rotas de autenticação (login/register)
    ├── user.test.js                  # Testes das rotas de usuários
    ├── account.test.js               # Testes das rotas de contas
    ├── category.test.js              # Testes das rotas de categorias
    └── transaction.test.js           # Testes das rotas de transações
```

## Dependências de Teste

- **Jest**: Framework de testes
- **Supertest**: Testes de integração HTTP
- **@jest/globals**: Utilitários globais do Jest

## Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa ao detectar mudanças)
npm run test:watch

# Executar testes com cobertura de código
npm test -- --coverage
```

## Cobertura de Testes

Os testes cobrem:

### 1. Rotas de Autenticação (`auth.test.js`)
- ✅ POST /register - Registro de usuário
- ✅ POST /login - Login com credenciais válidas e inválidas
- ✅ Validação de email/senha
- ✅ Tratamento de erros

### 2. Rotas de Usuários (`user.test.js`)
- ✅ GET /getAllUsers - Listar todos os usuários
- ✅ Autenticação necessária
- ✅ Tratamento de erros

### 3. Rotas de Contas (`account.test.js`)
- ✅ POST /addAccount - Criar nova conta
- ✅ GET /getAccountById/:id - Buscar conta por ID
- ✅ GET /balance/:id - Consultar saldo
- ✅ Validação de usuário existente
- ✅ Autenticação necessária

### 4. Rotas de Categorias (`category.test.js`)
- ✅ POST /addCategory - Criar categoria
- ✅ GET /getAllCategories - Listar categorias
- ✅ GET /getCategoryByName - Buscar por nome
- ✅ GET /categorySpendingRanking - Ranking de gastos
- ✅ Filtros por período e tipo
- ✅ Validação de dados

### 5. Rotas de Transações (`transaction.test.js`)
- ✅ POST /addTransaction - Criar transação (depósito/retirada)
- ✅ GET /getAllTransactions - Listar transações
- ✅ GET /getTransactionById/:id - Buscar transação
- ✅ PUT /updateTransaction/:id - Atualizar transação
- ✅ DELETE /deleteTransaction/:id - Deletar transação
- ✅ Atualização de saldo da conta
- ✅ Validação de conta existente

### 6. Middleware de Autenticação (`authMiddleware.test.js`)
- ✅ Validação de token JWT
- ✅ Formato do header Authorization
- ✅ Token expirado
- ✅ Token inválido
- ✅ Assinatura incorreta

## Características dos Testes

- **Isolamento**: Cada teste é independente e não afeta os outros
- **Mocks**: Todos os modelos do banco de dados são mockados
- **Cobertura Completa**: Testa cenários de sucesso e erro
- **Autenticação**: Testa rotas protegidas e públicas
- **Validações**: Verifica todas as validações de entrada

## Exemplo de Execução

```bash
# Instalar dependências (se necessário)
npm install

# Executar testes
npm test

# Saída esperada:
# PASS  __tests__/routes/auth.test.js
# PASS  __tests__/routes/user.test.js
# PASS  __tests__/routes/account.test.js
# PASS  __tests__/routes/category.test.js
# PASS  __tests__/routes/transaction.test.js
# PASS  __tests__/middlewares/authMiddleware.test.js
#
# Test Suites: 6 passed, 6 total
# Tests:       XX passed, XX total
```

## Observações

- Os testes utilizam variáveis de ambiente mockadas
- Não é necessário ter o banco de dados rodando para executar os testes
- Todos os models são mockados para evitar dependências externas
- Os testes validam tanto o comportamento esperado quanto casos de erro

## Manutenção

Ao adicionar novas rotas ou funcionalidades:

1. Crie um novo arquivo de teste na pasta apropriada
2. Mock os models necessários
3. Teste cenários de sucesso e erro
4. Verifique a cobertura de código
5. Execute todos os testes para garantir que nada foi quebrado
