# Friends Module - Testing Guide

## Pré-requisitos

1. Backend rodando em `http://localhost:3000`
2. Dois usuários criados (User A e User B)
3. Tokens JWT válidos para ambos os usuários

## Setup de Teste

### 1. Criar Usuários (se não existirem)

```bash
# Criar User A
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user-a@test.com",
    "password": "password123",
    "name": "User A"
  }'

# Criar User B
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user-b@test.com",
    "password": "password123",
    "name": "User B"
  }'
```

### 2. Fazer Login e Obter Tokens

```bash
# Login User A
TOKEN_A=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user-a@test.com",
    "password": "password123"
  }' | jq -r '.access_token')

echo "Token User A: $TOKEN_A"

# Login User B
TOKEN_B=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user-b@test.com",
    "password": "password123"
  }' | jq -r '.access_token')

echo "Token User B: $TOKEN_B"

# Obter IDs dos usuários
USER_A_ID=$(curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer $TOKEN_A" | jq -r '.id')

USER_B_ID=$(curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.id')

echo "User A ID: $USER_A_ID"
echo "User B ID: $USER_B_ID"
```

---

## Casos de Teste

### Teste 1: Fluxo Completo de Amizade

#### 1.1 User A envia solicitação para User B

```bash
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\"
  }"
```

**Resposta esperada (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-a-id",
  "receiverId": "user-b-id",
  "status": "pending",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

**Notas:**
- Status é "pending"
- Timestamp de criação registrado

#### 1.2 User B lista solicitações pendentes

```bash
curl -X GET http://localhost:3000/friends/requests/pending \
  -H "Authorization: Bearer $TOKEN_B"
```

**Resposta esperada (200):**
```json
[
  {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "requester": {
      "id": "user-a-id",
      "name": "User A",
      "email": "user-a@test.com",
      "photo": "https://..."
    },
    "requestedAt": "2026-03-27T10:30:45.000Z"
  }
]
```

**Notas:**
- Endpoint retorna solicitações apenas para o usuário logado
- Inclui informações do solicitante

#### 1.3 User B aceita a solicitação

```bash
FRIENDSHIP_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:3000/friends/respond \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"requestId\": \"$FRIENDSHIP_ID\",
    \"status\": \"accepted\"
  }"
```

**Resposta esperada (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-a-id",
  "receiverId": "user-b-id",
  "status": "accepted",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

#### 1.4 Ambos os usuários listam seus amigos

```bash
# User A lista amigos
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer $TOKEN_A"

# User B lista amigos
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer $TOKEN_B"
```

**Resposta esperada (200):**
```json
[
  {
    "friendshipId": "550e8400-e29b-41d4-a716-446655440000",
    "id": "user-b-id",
    "name": "User B",
    "email": "user-b@test.com",
    "photo": "https://...",
    "phone": "+351912345678",
    "acceptedAt": "2026-03-27T10:30:45.000Z"
  }
]
```

#### 1.5 User A remove amigo

```bash
curl -X DELETE http://localhost:3000/friends/$FRIENDSHIP_ID \
  -H "Authorization: Bearer $TOKEN_A"
```

**Resposta esperada (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-a-id",
  "receiverId": "user-b-id",
  "status": "accepted",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

#### 1.6 Verificar que amigo foi removido

```bash
# User B já não vê User A como amigo
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer $TOKEN_B"
```

**Resposta esperada (200):**
```json
[]
```

---

### Teste 2: Rejeição de Solicitação

#### 2.1 User A envia nova solicitação

```bash
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\"
  }"
```

Guardar o ID retornado como `FRIENDSHIP_ID_2`

#### 2.2 User B rejeita solicitação

```bash
curl -X POST http://localhost:3000/friends/respond \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"requestId\": \"$FRIENDSHIP_ID_2\",
    \"status\": \"rejected\"
  }"
```

**Resposta esperada (200):**
```json
{
  "id": "...",
  "requesterId": "user-a-id",
  "receiverId": "user-b-id",
  "status": "rejected",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

#### 2.3 Verificar que não aparecem como amigos

```bash
# Nenhum dos dois deve listar o outro como amigo
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer $TOKEN_A"
```

---

### Teste 3: Validações e Erros

#### 3.1 Tentar enviar solicitação para si mesmo

```bash
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_A_ID\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot send friend request to yourself",
  "error": "Bad Request"
}
```

#### 3.2 Tentar enviar solicitação com UUID inválido

```bash
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"invalid-uuid\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": ["Receiver ID must be a valid UUID"],
  "error": "Bad Request"
}
```

#### 3.3 Tentar aceitar solicitação sem ser o receptor

```bash
# User A (que enviou) tenta aceitar
curl -X POST http://localhost:3000/friends/respond \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"requestId\": \"$FRIENDSHIP_ID_2\",
    \"status\": \"accepted\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Only the receiver can respond to this friend request",
  "error": "Bad Request"
}
```

#### 3.4 Tentar aceitar solicitação inválida

```bash
curl -X POST http://localhost:3000/friends/respond \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"requestId\": \"550e8400-e29b-41d4-a716-000000000000\",
    \"status\": \"accepted\"
  }"
```

**Resposta esperada (404):**
```json
{
  "statusCode": 404,
  "message": "Friend request ... not found",
  "error": "Not Found"
}
```

#### 3.5 Tentar remover amizo sem permissão

Supondo User C (não parte da amizade):

```bash
curl -X DELETE http://localhost:3000/friends/$FRIENDSHIP_ID \
  -H "Authorization: Bearer $TOKEN_C"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "You cannot remove a friendship you are not part of",
  "error": "Bad Request"
}
```

#### 3.6 Duplicação de solicitação

```bash
# Enviar solicitação novamente
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\"
  }"

# Enviar de novo - deve falhar
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\"
  }"
```

**Segunda resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Friend request or friendship already exists between these users",
  "error": "Bad Request"
}
```

---

### Teste 4: Autenticação

#### 4.1 Sem token

```bash
curl -X GET http://localhost:3000/friends
```

**Resposta esperada (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 4.2 Com token inválido

```bash
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer invalid-token"
```

**Resposta esperada (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Script Automatizado de Teste

Salvar como `test-friends.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local token=$4
  local data=$5
  
  echo -e "${YELLOW}Test: $name${NC}"
  
  if [ -z "$data" ]; then
    curl -X $method "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -w "\nStatus: %{http_code}\n" | jq .
  else
    curl -X $method "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d "$data" \
      -w "\nStatus: %{http_code}\n" | jq .
  fi
  
  echo ""
}

# Criar usuários
echo -e "${YELLOW}=== Creating Users ===${NC}"
REG_A=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-a@test.com",
    "password": "password123",
    "name": "Test User A"
  }' | jq -r '.id')

REG_B=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-b@test.com",
    "password": "password123",
    "name": "Test User B"
  }' | jq -r '.id')

echo "User A ID: $REG_A"
echo "User B ID: $REG_B"
echo ""

# Login
echo -e "${YELLOW}=== Login ===${NC}"
LOGIN_A=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-a@test.com",
    "password": "password123"
  }')

LOGIN_B=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-b@test.com",
    "password": "password123"
  }')

TOKEN_A=$(echo $LOGIN_A | jq -r '.access_token')
TOKEN_B=$(echo $LOGIN_B | jq -r '.access_token')

echo "Token A: ${TOKEN_A:0:20}..."
echo "Token B: ${TOKEN_B:0:20}..."
echo ""

# Testes
echo -e "${YELLOW}=== Running Tests ===${NC}"

# Test 1: Send request
test_endpoint "Send friend request" "POST" "/friends/request" "$TOKEN_A" "{\"receiverId\": \"$REG_B\"}"

# Test 2: Get pending requests
test_endpoint "Get pending requests" "GET" "/friends/requests/pending" "$TOKEN_B" ""

# Test 3: Accept request (IDs seriam necessários do output anterior)
# ... (kontinuar conforme necessário)
```

---

## Verificação de Logging

Para verificar que todas as operações estão sendo registradas:

```bash
# Terminal 1: Iniciar backend com logs
npm run start:dev

# Terminal 2: Executar testes
bash test-friends.sh
```

**Logs esperados:**
```
[NestFactory] Starting Nest application...
[InstanceLoader] FriendsModule dependencies initialized
[FriendsController] User user-a-id sending friend request to user-b-id
[FriendsService] User user-a-id sending friend request to user-b-id
[FriendsRepository] Creating friend request from user-a-id to user-b-id
[FriendsService] Friend request created: 550e8400-e29b-41d4-a716-446655440000
```

---

## Checklist Final

- [ ] ✅ Enviar solicitação funciona
- [ ] ✅ Receber e aceitar solicitação funciona
- [ ] ✅ Rejeitar solicitação funciona
- [ ] ✅ Listar amigos funciona
- [ ] ✅ Listar solicitações pendentes funciona
- [ ] ✅ Remover amigo funciona
- [ ] ✅ Validações estão funcionando
- [ ] ✅ Erros são retornados corretamente
- [ ] ✅ Autenticação JWT está funcionando
- [ ] ✅ Logging registra todas operações
- [ ] ✅ Swagger docs aparecem corretamente
- [ ] ✅ Nenhuma impersonação é possível (requesterId sempre do JWT)
