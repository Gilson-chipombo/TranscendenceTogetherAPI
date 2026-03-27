# Friends Module

Gerenciamento de amizades e solicitações de amizade entre usuários com sistema completo de aceitação/rejeição de solicitações.

## Endpoints

### 1. Enviar Solicitação de Amizade
**POST** `/friends/request`

Envia uma solicitação de amizade para outro usuário.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "receiverId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-123",
  "receiverId": "user-456",
  "status": "pending",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

**Validações:**
- `receiverId` obrigatório e deve ser um UUID válido
- Não permite enviar solicitação para si mesmo
- Verifica se solicitação ou amizade já existe

**Erros Possíveis:**
- `400`: Receptor não encontrado, solicitação duplicada
- `401`: Não autenticado

---

### 2. Responder Solicitação de Amizade
**POST** `/friends/respond`

Aceita ou rejeita uma solicitação de amizade pendente.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "accepted"
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-123",
  "receiverId": "user-456",
  "status": "accepted",
  "block": false,
  "createdAt": "2026-03-27T10:30:45.000Z"
}
```

**Validações:**
- `requestId` obrigatório e deve ser um UUID válido
- `status` obrigatório, deve ser "accepted" ou "rejected"
- Apenas o receptor pode responder
- Não pode responder a solicitações já respondidas

**Erros Possíveis:**
- `400`: Dados inválidos, sem permissão
- `401`: Não autenticado
- `404`: Solicitação não encontrada

---

### 3. Listar Amigos
**GET** `/friends`

Retorna lista de todos os amigos aceitos do usuário autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "friendshipId": "550e8400-e29b-41d4-a716-446655440000",
    "id": "user-456",
    "name": "Maria",
    "email": "maria@example.com",
    "photo": "https://example.com/photo.jpg",
    "phone": "+351912345678",
    "acceptedAt": "2026-03-20T10:30:45.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado

---

### 4. Listar Solicitações Pendentes
**GET** `/friends/requests/pending`

Retorna lista de solicitações de amizade pendentes recebidas pelo usuário.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "requester": {
      "id": "user-123",
      "name": "João",
      "email": "joao@example.com",
      "photo": "https://example.com/photo.jpg"
    },
    "requestedAt": "2026-03-27T10:30:45.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Não autenticado

---

### 5. Remover Amigo
**DELETE** `/friends/:friendshipId`

Remove uma amizade (qualquer uma das partes pode remover).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "requesterId": "user-123",
  "receiverId": "user-456",
  "status": "accepted",
  "block": false,
  "createdAt": "2026-03-20T10:30:45.000Z"
}
```

**Validações:**
- `friendshipId` obrigatório e deve ser um UUID válido
- Apenas membros da amizade podem removê-la

**Erros Possíveis:**
- `400`: Dados inválidos, sem permissão
- `401`: Não autenticado
- `404`: Amizade não encontrada

---

## Fluxo de Amizade

```
┌─────────────────────────────────────────────────────┐
│   Usuário A                        Usuário B         │
└─────────────────────────────────────────────────────┘

1. POST /friends/request
   {receiverId: "user-b"}
   ↓
   Cria Friendship com status: "pending"
   
2. Usuário B recebe no GET /friends/requests/pending

3. POST /friends/respond
   {requestId: "...", status: "accepted"}
   ↓
   Atualiza Friendship para status: "accepted"
   
4. Ambos veem um ao outro em GET /friends

5. DELETE /friends/:friendshipId
   ↓
   Remove a amizade
```

---

## Modelos de Dados

### Friendship
```typescript
{
  id: string;              // UUID
  requesterId: string;     // UUID do usuário que enviou
  receiverId: string;      // UUID do usuário que recebeu
  status: "pending" | "accepted" | "rejected";
  block: boolean;          // Reservado para bloqueio futuro
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Segurança

- ✅ **Autenticação JWT**: Todos os endpoints requerem Bearer token válido
- ✅ **Validação de Entrada**: Todos os campos validados com class-validator
- ✅ **Autorização**: Apenas o receptor pode responder solicitações
- ✅ **Impersonação Bloqueada**: User ID extraído do JWT, não do corpo da requisição
- ✅ **Prevenção de Auto-Amizade**: Valida se requesterId !== receiverId
- ✅ **Duplicação Evitada**: Impede múltiplas solicitações/amizades entre mesmos usuários
- ✅ **Logging**: Todas as operações registradas para auditoria

---

## Exemplos de Uso

### Exemplo 1: Fluxo Completo de Amizade

```bash
# 1. Usuário A envia solicitação
curl -X POST http://localhost:3000/friends/request \
  -H "Authorization: Bearer token-user-a" \
  -H "Content-Type: application/json" \
  -d '{"receiverId": "550e8400-e29b-41d4-a716-446655440000"}'

# 2. Usuário B vê solicitações pendentes
curl -X GET http://localhost:3000/friends/requests/pending \
  -H "Authorization: Bearer token-user-b"

# 3. Usuário B aceita solicitação
curl -X POST http://localhost:3000/friends/respond \
  -H "Authorization: Bearer token-user-b" \
  -H "Content-Type: application/json" \
  -d '{"requestId": "550e8400-e29b-41d4-a716-446655440000", "status": "accepted"}'

# 4. Ambos podem listar amigos
curl -X GET http://localhost:3000/friends \
  -H "Authorization: Bearer token-user-a"

# 5. Remover amigo
curl -X DELETE http://localhost:3000/friends/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer token-user-a"
```

---

## Validações

### SendFriendRequestDto
- `receiverId`: string, UUID válido, obrigatório

### RespondFriendRequestDto
- `requestId`: string, UUID válido, obrigatório
- `status`: enum ["accepted", "rejected"]

---

## Melhorias Futuras

- [ ] Bloqueio de usuários (usar campo `block` existente)
- [ ] Listagem de usuários bloqueados
- [ ] Notificações em tempo real de solicitações (WebSocket)
- [ ] Paginação em listas de amigos
- [ ] Busca de amigos por nome/email
- [ ] Sugestões de amigos

---

## Troubleshooting

**"No receiver can respond to this friend request"**
- Certifique-se de que está logado como o receptor da solicitação

**"Friend request or friendship already exists"**
- Uma solicitação já foi enviada ou existe amizade ativa entre os usuários

**"Cannot send friend request to yourself"**
- Não é possível enviar solicitação para a mesma conta

**"Friendship not found"**
- O ID da amizade é inválido ou foi removido
