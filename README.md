# BANIF — Sistema Bancário Digital

Sistema bancário completo desenvolvido como trabalho de conclusão para  disciplina de WEBII com módulo de Gerente e Cliente.

## Tecnologias

**Backend:** AdonisJS v7 · TypeScript · Lucid ORM · MySQL · Auth OAT  
**Frontend:** React · TypeScript · TailwindCSS · Axios · React Router · Zustand

---

## Como Iniciar

### Backend

```bash
cd backend
npm run dev
# Servidor: http://localhost:3333
```

### Frontend

```bash
cd frontend
npm run dev
# Aplicação: http://localhost:5173
```

---

## Credenciais Padrão

| Perfil  | E-mail             | Senha         |
|---------|--------------------|---------------|
| Gerente | admin@banif.com    | admin123456   |

> Clientes são cadastrados pelo gerente através do painel ou da API.

---

## Estrutura do Projeto

```
BanifAPP/
├── backend/
│   ├── app/
│   │   ├── controllers/       # AuthController, ClientsController, ...
│   │   ├── services/          # Regras de negócio
│   │   ├── repositories/      # Acesso ao banco via ORM
│   │   ├── models/            # User, BankAccount, Transaction, ...
│   │   ├── validators/        # Validação de entrada
│   │   └── middleware/        # auth, role
│   ├── database/
│   │   ├── migrations/        # 7 migrations
│   │   └── seeders/           # Gerente + Tipos de investimento
│   └── start/
│       └── routes.ts          # Todas as rotas da API
└── frontend/
    └── src/
        ├── api/               # Instância Axios + interceptors
        ├── store/             # Zustand auth store
        ├── services/          # Chamadas à API
        ├── pages/
        │   ├── Login.tsx
        │   ├── manager/       # ManagerDashboard
        │   └── client/        # ClientDashboard, Pix, Statement, Investments
        └── components/        # Layout, Navbar, ProtectedRoute, UI
```

---

## API REST — Exemplos de Requisições

### POST /auth/login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@banif.com","senha":"admin123456"}'
```
**Resposta:**
```json
{
  "token": "oat_...",
  "user": { "id": 1, "nomeCompleto": "Administrador BANIF", "role": "MANAGER" }
}
```

---

### POST /clients *(MANAGER)*
```bash
curl -X POST http://localhost:3333/clients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "cpf": "123.456.789-00",
    "endereco": { "cidade": "São Paulo", "estado": "SP", "rua": "Rua X", "numero": "10" }
  }'
```

---

### POST /accounts *(MANAGER)*
```bash
# Sem saldo inicial
curl -X POST http://localhost:3333/accounts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "usuarioId": 2, "numeroConta": "12345-6", "numeroAgencia": "0001" }'

# Com saldo inicial (registra transação DEPOSIT automaticamente)
curl -X POST http://localhost:3333/accounts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "usuarioId": 2, "numeroConta": "12345-6", "numeroAgencia": "0001", "initialBalance": 1000.00 }'
```
**Resposta:**
```json
{
  "id": 1,
  "usuarioId": 2,
  "numeroConta": "12345-6",
  "numeroAgencia": "0001",
  "balance": 1000
}
```

---

### GET /balance *(CLIENT)*
```bash
curl http://localhost:3333/balance \
  -H "Authorization: Bearer <token>"
```
**Resposta:** `{ "numeroConta": "12345-6", "numeroAgencia": "0001", "balance": 4800 }`

---

### GET /statement *(CLIENT)*
```bash
curl http://localhost:3333/statement \
  -H "Authorization: Bearer <token>"
```

---

### POST /pix *(CLIENT)*
```bash
curl -X POST http://localhost:3333/pix \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "numeroConta": "98765-4", "valor": 200 }'
```

---

### GET /investments/types *(CLIENT)*
```bash
curl http://localhost:3333/investments/types \
  -H "Authorization: Bearer <token>"
```

---

### POST /investments *(CLIENT)*
```bash
curl -X POST http://localhost:3333/investments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "tipoInvestimentoId": 1, "valor": 500 }'
```

---

### POST /investments/:id/rescue *(CLIENT)*
```bash
curl -X POST http://localhost:3333/investments/1/rescue \
  -H "Authorization: Bearer <token>"
```

---

## Regras de Negócio

### Perfis
| Ação                    | MANAGER | CLIENT |
|-------------------------|:-------:|:------:|
| Cadastrar cliente       | ✅      | ❌     |
| Criar conta bancária    | ✅      | ❌     |
| Consultar saldo         | ❌      | ✅     |
| Fazer Pix               | ❌      | ✅     |
| Ver extrato             | ❌      | ✅     |
| Investir                | ❌      | ✅     |
| Resgatar investimento   | ❌      | ✅     |

### Pix
- Valida conta destino existente
- Valida saldo suficiente
- Usa transação atômica no banco
- Registra PIX_SENT e PIX_RECEIVED no extrato

### Investimentos
- Débita o saldo imediatamente ao investir
- Resgate devolve o valor ao saldo
- Status: ACTIVE → RESCUED

---

## Tabelas do Banco

| Tabela               | Descrição                     |
|----------------------|-------------------------------|
| `usuarios`           | Usuários (gerentes e clientes)|
| `enderecos`          | Endereço de cada usuário      |
| `contas_bancarias`   | Contas correntes              |
| `transacoes`         | Histórico de movimentações    |
| `investimentos`      | Aplicações financeiras        |
| `tipos_investimentos`| Poupança, Títulos, Ações      |
| `auth_access_tokens` | Tokens de autenticação OAT    |
