# Direct Message Module - Testing Guide

## Pré-requisitos

1. Backend rodando em `http://localhost:3000`
2. Dois usuários criados (User A e User B)
3. Tokens JWT válidos para ambos os usuários
4. WebSocket client library (socket.io-client para browser)

## Setup de Teste

### 1. Criar Usuários (se não existirem)

```bash
# Criar User A
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm-user-a@test.com",
    "password": "password123",
    "name": "DM User A"
  }'

# Criar User B
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm-user-b@test.com",
    "password": "password123",
    "name": "DM User B"
  }'
```

### 2. Fazer Login e Obter Tokens

```bash
# Login User A
TOKEN_A=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm-user-a@test.com",
    "password": "password123"
  }' | jq -r '.access_token')

echo "Token User A: $TOKEN_A"

# Login User B
TOKEN_B=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm-user-b@test.com",
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

## REST API Tests

### Teste 1: Enviar Mensagem Simples

```bash
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"Olá, tudo bem?\"
  }"
```

**Resposta esperada (201):**
```json
{
  "id": "clp123abc456",
  "senderId": "user-a-id",
  "receiverId": "user-b-id",
  "content": "Olá, tudo bem?",
  "createdAt": "2026-03-27T10:30:45.000Z",
  "updatedAt": "2026-03-27T10:30:45.000Z"
}
```

Guardar o `id` como `MESSAGE_ID_1`

---

### Teste 2: Obter Conversa

```bash
curl -X GET http://localhost:3000/dm/$USER_B_ID \
  -H "Authorization: Bearer $TOKEN_A"
```

**Resposta esperada (200):**
```json
[
  {
    "id": "clp123abc456",
    "senderId": "user-a-id",
    "receiverId": "user-b-id",
    "content": "Olá, tudo bem?",
    "createdAt": "2026-03-27T10:30:45.000Z",
    "updatedAt": "2026-03-27T10:30:45.000Z"
  }
]
```

**Notas:**
- User B pode ver a mesma conversa
- Mensagens ordenadas por data de criação

---

### Teste 3: Múltiplas Mensagens

```bash
# Mensagem 2 - User A para User B
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"Você está lá?\"
  }"

# Mensagem 3 - User B para User A (resposta)
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_A_ID\",
    \"content\": \"Oi! Tudo certo!\"
  }"

# Obter conversa - deve ter 3 mensagens
curl -X GET http://localhost:3000/dm/$USER_B_ID \
  -H "Authorization: Bearer $TOKEN_A"
```

**Resposta esperada (200):**
```json
[
  {
    "id": "clp123abc456",
    "senderId": "user-a-id",
    "receiverId": "user-b-id",
    "content": "Olá, tudo bem?",
    "createdAt": "2026-03-27T10:00:00.000Z"
  },
  {
    "id": "clp123abc457",
    "senderId": "user-a-id",
    "receiverId": "user-b-id",
    "content": "Você está lá?",
    "createdAt": "2026-03-27T10:05:00.000Z"
  },
  {
    "id": "clp123abc458",
    "senderId": "user-b-id",
    "receiverId": "user-a-id",
    "content": "Oi! Tudo certo!",
    "createdAt": "2026-03-27T10:10:00.000Z"
  }
]
```

---

## Validations Tests

### Teste 4: Mensagem Vazia

```bash
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": ["Content must be at least 1 character"],
  "error": "Bad Request"
}
```

---

### Teste 5: Mensagem Muito Longa

```bash
# Gerar string com 5001 caracteres
LONG_CONTENT=$(python3 -c "print('a' * 5001)")

curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"$LONG_CONTENT\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": ["Content must not exceed 5000 characters"],
  "error": "Bad Request"
}
```

---

### Teste 6: Receiver ID Inválido

```bash
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"invalid-uuid\",
    \"content\": \"Teste\"
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

---

### Teste 7: Enviar para Si Mesmo

```bash
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_A_ID\",
    \"content\": \"Mensagem para mim\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot send messages to yourself",
  "error": "Bad Request"
}
```

---

### Teste 8: Receiver Não Existe

```bash
FAKE_ID="550e8400-e29b-41d4-a716-000000000000"

curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$FAKE_ID\",
    \"content\": \"Teste\"
  }"
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Receiver user 550e8400-e29b-41d4-a716-000000000000 not found",
  "error": "Bad Request"
}
```

---

## Authentication Tests

### Teste 9: Sem Token

```bash
curl -X POST http://localhost:3000/dm \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"Teste\"
  }"
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

### Teste 10: Com Token Inválido

```bash
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json" \
  -d "{
    \"receiverId\": \"$USER_B_ID\",
    \"content\": \"Teste\"
  }"
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

## WebSocket Tests

### Teste 11: Conectar e Enviar Mensagem Real-time

**JavaScript:**
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket DM Test</h1>
  <input id="messageInput" type="text" placeholder="Mensagem">
  <button onclick="sendDM()">Enviar</button>
  <div id="messages"></div>

  <script>
    const TOKEN_A = 'your-token-a';
    const TOKEN_B = 'your-token-b';
    const USER_B_ID = 'user-b-id';
    
    // Socket para User A
    const socketA = io('http://localhost:3000', {
      auth: { token: TOKEN_A }
    });
    
    // Socket para User B
    const socketB = io('http://localhost:3000', {
      auth: { token: TOKEN_B }
    });

    socketA.on('connect', () => {
      console.log('User A conectado');
      socketA.data = { userId: 'user-a-id' };
    });

    socketB.on('connect', () => {
      console.log('User B conectado');
      socketB.data = { userId: 'user-b-id' };
    });

    // User B recebe mensagens
    socketB.on('receiver-dm', (message) => {
      console.log('User B recebeu:', message);
      document.getElementById('messages').innerHTML += 
        `<p><strong>${message.senderId}:</strong> ${message.content}</p>`;
    });

    // User A confirmação
    socketA.on('dm-sent', (data) => {
      console.log('Mensagem enviada:', data);
    });

    // Erros
    socketA.on('error', (error) => {
      console.error('User A erro:', error);
    });
    socketB.on('error', (error) => {
      console.error('User B erro:', error);
    });

    // Enviar mensagem
    function sendDM() {
      const content = document.getElementById('messageInput').value;
      socketA.emit('send-dm', {
        receiverId: USER_B_ID,
        content: content
      });
      document.getElementById('messageInput').value = '';
    }
  </script>
</body>
</html>
```

---

### Teste 12: WebSocket - Mensagem Vazia

```javascript
socketA.emit('send-dm', {
  receiverId: USER_B_ID,
  content: ''
});

// Esperar event 'error'
socketA.on('error', (error) => {
  console.log(error);
  // {
  //   "event": "send-dm",
  //   "message": "Content must be at least 1 character"
  // }
});
```

---

## Logging Verification

Para verificar que logging está funcionando:

```bash
# Terminal 1: Iniciar backend com logs
npm run start

# Terminal 2: Executar testes
bash test-dm.sh  # (script abaixo)
```

**Logs esperados:**
```
[NestFactory] Starting Nest application...
[DirectMessageModule] module loaded
[DirectMessageController] User user-a-id sending DM to user-b-id: "Teste..."
[DirectMessageService] Sending message from user-a-id to user-b-id
[DmRepository] Creating direct message from user-a-id to user-b-id
[DirectMessageService] Message sent: clp123abc456
[DmGateway] WebSocket DM from user-a-id to user-b-id
```

---

## Script Automatizado de Teste

Salvar como `test-dm.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "===== Direct Message Module Tests ====="

# Setup
echo "1. Criando usuários..."
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dm-test-a@test.com", "password": "pass123", "name": "DM Test A"}' > /dev/null

curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dm-test-b@test.com", "password": "pass123", "name": "DM Test B"}' > /dev/null

# Login
echo "2. Fazendo login..."
LOGIN_A=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dm-test-a@test.com", "password": "pass123"}')

TOKEN_A=$(echo $LOGIN_A | jq -r '.access_token')
USER_A_ID=$(echo $LOGIN_A | jq -r '.id // .userId')

LOGIN_B=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dm-test-b@test.com", "password": "pass123"}')

TOKEN_B=$(echo $LOGIN_B | jq -r '.access_token')
USER_B_ID=$(echo $LOGIN_B | jq -r '.id // .userId')

echo "User A: $USER_A_ID"
echo "User B: $USER_B_ID"

# Test 1: Send message
echo "3. Enviando mensagem..."
RESPONSE=$(curl -s -X POST $BASE_URL/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\": \"$USER_B_ID\", \"content\": \"Test message\"}")

echo "Response: $RESPONSE"
MESSAGE_ID=$(echo $RESPONSE | jq -r '.id')
echo "Message ID: $MESSAGE_ID"

# Test 2: Get conversation
echo "4. Obtendo conversa..."
curl -s -X GET $BASE_URL/dm/$USER_B_ID \
  -H "Authorization: Bearer $TOKEN_A" | jq .

# Test 3: Validation - empty content
echo "5. Testando validação (mensagem vazia)..."
curl -s -X POST $BASE_URL/dm \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\": \"$USER_B_ID\", \"content\": \"\"}" | jq .

# Test 4: Authentication - no token
echo "6. Testando autenticação (sem token)..."
curl -s -X POST $BASE_URL/dm \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\": \"$USER_B_ID\", \"content\": \"Test\"}" | jq .

echo "===== Tests Complete ====="
```

---

## Checklist Final

- [ ] ✅ Enviar mensagem funciona
- [ ] ✅ Receber conversa funciona
- [ ] ✅ Validações estão funcionando
- [ ] ✅ Erros são retornados corretamente
- [ ] ✅ Autenticação JWT está funcionando
- [ ] ✅ Logging registra todas operações
- [ ] ✅ WebSocket conecta corretamente
- [ ] ✅ WebSocket envia mensagens
- [ ] ✅ WebSocket recebe mensagens
- [ ] ✅ WebSocket error handling funciona
- [ ] ✅ Swagger docs aparecem corretamente
- [ ] ✅ Nenhuma impersonation é possível
