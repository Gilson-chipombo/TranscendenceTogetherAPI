# Direct Messages Module

Sistema completo de mensagens diretas entre usuários com suporte a REST e WebSocket em tempo real.

## Endpoints

### 1. Enviar Mensagem Direta
**POST** `/dm`

Envia uma mensagem direta para outro usuário.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "receiverId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Hey, how are you?"
}
```

**Response (201):**
```json
{
  "id": "clp123abc456",
  "senderId": "user-123",
  "receiverId": "user-456",
  "content": "Hey, how are you?",
  "createdAt": "2026-03-27T10:30:45.000Z",
  "updatedAt": "2026-03-27T10:30:45.000Z"
}
```

**Validações:**
- `receiverId` obrigatório, deve ser um UUID válido
- `content` obrigatório, mínimo 1 caractere, máximo 5000 caracteres
- Não permite enviar mensagem para si mesmo
- Ambos os usuários devem existir no banco de dados

**Erros Possíveis:**
- `400`: Dados inválidos, usuário não encontrado, auto-mensagem
- `401`: Não autenticado

---

### 2. Obter Conversa
**GET** `/dm/:receiverId`

Retorna todas as mensagens em uma conversa, ordenadas por data de criação.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "clp123abc456",
    "senderId": "user-123",
    "receiverId": "user-456",
    "content": "Hey!",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "updatedAt": "2026-03-27T10:00:00.000Z"
  },
  {
    "id": "clp123abc457",
    "senderId": "user-456",
    "receiverId": "user-123",
    "content": "Hi there!",
    "createdAt": "2026-03-27T10:05:00.000Z",
    "updatedAt": "2026-03-27T10:05:00.000Z"
  }
]
```

**Parâmetros:**
- `receiverId` obrigatório no path

**Erros Possíveis:**
- `400`: ID inválido
- `401`: Não autenticado

---

## WebSocket Events

### Enviar Mensagem (Cliente → Servidor)

**Event:** `send-dm`

```javascript
// Client
socket.emit('send-dm', {
  receiverId: 'user-456-id',
  content: 'Hey from WebSocket!'
});
```

**Validações (iguais a REST):**
- `receiverId` obrigatório, UUID válido
- `content` obrigatório, 1-5000 caracteres
- User ID extraído do token

---

### Resposta - Mensagem Enviada (Servidor → Cliente)

**Event:** `dm-sent`

Enviado de volta ao remetente como confirmação:

```javascript
// Server Response
{
  "id": "clp123abc456",
  "status": "sent"
}
```

---

### Receber Mensagem (Servidor → Cliente)

**Event:** `receiver-dm`

Enviado ao receptor em tempo real quando uma mensagem é recebida:

```javascript
// Receptor recebe
socket.on('receiver-dm', (message) => {
  console.log(`Nova mensagem de ${message.senderId}: ${message.content}`);
  // {
  //   "id": "clp123abc456",
  //   "senderId": "user-123",
  //   "receiverId": "user-456",
  //   "content": "Hey from WebSocket!",
  //   "createdAt": "2026-03-27T10:30:45.000Z",
  //   "updatedAt": "2026-03-27T10:30:45.000Z"
  // }
});
```

---

### Erro (Servidor → Cliente)

**Event:** `error`

Enviado quando ocorre erro no WebSocket:

```javascript
socket.on('error', (error) => {
  console.log(`Erro: ${error.message}`);
  // {
  //   "event": "send-dm",
  //   "message": "Cannot send messages to yourself"
  // }
});
```

---

## Fluxo de Mensagens Diretas

### REST Flow (Polling)
```
┌─────────────────────────────────────────────┐
│   Usuário A (Cliente)   Usuário B (Cliente) │
└─────────────────────────────────────────────┘

1. POST /dm
   {receiverId: "B", content: "oi"}
   ↓
   Salva mensagem no BD
   
2. Usuário B faz polling
   GET /dm/A-id
   ↓
   Retorna histórico com nova mensagem
```

### WebSocket Flow (Real-time)
```
┌─────────────────────────────────────────────┐
│   Usuário A (WebSocket)  Usuário B (Socket) │
└─────────────────────────────────────────────┘

1. A emite: send-dm {receiverId: "B", content: "oi"}
   ↓
   Salva no BD
   ↓
   A recebe: dm-sent {id: "...", status: "sent"} ✅

2. B conectado? (Sim)
   ↓
   B recebe: receiver-dm {id: "...", content: "oi", ...} 🔔
   
3. B desconectado?
   ↓
   Próxima conexão: GET /dm/A-id vai recuperar histórico
```

---

## Exemplos de Uso

### Exemplo 1: Enviar Mensagem via REST

```bash
# Obter token
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }' | jq -r '.access_token')

# Enviar mensagem
curl -X POST http://localhost:3000/dm \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Hey! How are you?"
  }'
```

---

### Exemplo 2: Obter Conversa via REST

```bash
curl -X GET http://localhost:3000/dm/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Exemplo 3: WebSocket em Tempo Real (JavaScript)

```javascript
// Conectar ao WebSocket
const socket = io('http://localhost:3000', {
  auth: {
    token: TOKEN,
  },
});

// Fazer autenticação no WebSocket
socket.on('connect', () => {
  console.log('Conectado ao servidor');
  
  // Armazenar userId no socket para identificação
  socket.data = { userId: USER_ID };
});

// Enviar mensagem
function sendDM(receiverId, content) {
  socket.emit('send-dm', {
    receiverId,
    content,
  });
}

// Receber confirmação de enviado
socket.on('dm-sent', (data) => {
  console.log(`Mensagem enviada: ${data.id}`);
});

// Receber nova mensagem
socket.on('receiver-dm', (message) => {
  console.log(`${message.senderId}: ${message.content}`);
  updateChatUI(message);
});

// Tratar erros
socket.on('error', (error) => {
  console.error(`Erro WebSocket: ${error.message}`);
});

// Enviar ao apertar Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const content = e.target.value;
    sendDM(RECEIVER_ID, content);
    e.target.value = '';
  }
});
```

---

### Exemplo 4: WebSocket em Tempo Real (Python)

```python
import socketio
import json

# Criar cliente
sio = socketio.Client(auth={'token': TOKEN})

# Conectar
@sio.event
def connect():
    print('Conectado')
    
# Enviar mensagem
@sio.event
def send_dm(receiver_id, content):
    sio.emit('send-dm', {
        'receiverId': receiver_id,
        'content': content
    })

# Receber mensagem
@sio.event
def receiver_dm(data):
    print(f"{data['senderId']}: {data['content']}")

# Tratar erros
@sio.event
def error(error):
    print(f"Erro: {error['message']}")

# Conectar e enviar
sio.connect('http://localhost:3000')

send_dm('550e8400-e29b-41d4-a716-446655440000', 'Olá!')

sio.wait()
```

---

## DTOs

### SendDmDto
```typescript
{
  receiverId: string;   // UUID válido, obrigatório
  content: string;      // 1-5000 caracteres, obrigatório
}
```

---

## Modelos de Dados

### DirectMessage
```typescript
{
  id: string;              // ID único (CUID)
  senderId: string;        // UUID do remetente
  receiverId: string;      // UUID do destinatário
  content: string;         // Conteúdo da mensagem
  createdAt: Date;         // Timestamp de criação
  updatedAt: Date;         // Timestamp de atualização
}
```

---

## Segurança

- ✅ **Autenticação JWT**: Todos os endpoints requerem Bearer token
- ✅ **Validação de Entrada**: Todos os campos validados com mensagens customizadas
- ✅ **Impersonação Bloqueada**: Sender ID extraído do JWT, não do corpo
- ✅ **Prevenção de Auto-Mensagem**: Não permite enviar para si mesmo
- ✅ **Existência de Usuários**: Verifica se remetente e destinatário existem
- ✅ **Logging**: Todas as operações registradas
- ✅ **Error Handling**: Tratamento robusto de erros em REST e WebSocket
- ✅ **CORS Configurável**: Usa variável de ambiente

---

## Validações

### SendDmDto
- `receiverId`: string, UUID válido, obrigatório
- `content`: string, 1-5000 caracteres, obrigatório, trimmed automaticamente

---

## Melhorias Futuras

- [ ] Tipagem de mensagens (texto, imagem, arquivo)
- [ ] Reações a mensagens
- [ ] Edição de mensagens
- [ ] Deleção de mensagens
- [ ] Notificação de "digitando..."
- [ ] Leitura de mensagens (seen/read)
- [ ] Bloqueio de usuários
- [ ] Busca em conversas
- [ ] Histórico com paginação

---

## Troubleshooting

**"Cannot send messages to yourself"**
- Você está tentando enviar mensagem para sua própria conta

**"Receiver user ... not found"**
- O ID do receptor é inválido ou o usuário não existe

**"User not authenticated"**
- Token JWT ausente ou inválido no header Authorization
- Para WebSocket: token não foi enviado no auth

**WebSocket desconecta sem avisar**
- Verifique se token de autenticação expirou
- Verifique conexão de rede

**"Content must be at least 1 character"**
- Mensagem vazia não é permitida

**"Content must not exceed 5000 characters"**
- Limite de comprimento excedido

---

## Status da Implementação

- ✅ REST API (POST enviar, GET conversa)
- ✅ WebSocket em tempo real
- ✅ Validação robusta
- ✅ JWT authentication
- ✅ Error handling
- ✅ Logging estruturado
- ✅ Swagger documentation
- ✅ Type safety completo
