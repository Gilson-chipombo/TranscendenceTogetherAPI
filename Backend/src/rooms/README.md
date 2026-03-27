# Rooms Module - Documentação

Módulo responsável pela criação e gestão de salas de chat no Together.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura](#estrutura)
3. [Endpoints](#endpoints)
4. [DTOs](#dtos)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Melhorias Implementadas](#melhorias-implementadas)

---

## 🎯 Visão Geral

O módulo **Rooms** permite que utilizadores criem salas de chat e convidem outras pessoas usando um **token de convite único** (UUID). Cada sala pertence a um utilizador **host** que é o criador.

### Funcionalidades Principais

- ✅ **Criar Salas**: Utilizadores autenticados podem criar novas salas
- ✅ **Convites Únicos**: Cada sala tem um token de convite exclusivo e permanente
- ✅ **Juntar-se a Salas**: Outros utilizadores podem se juntar usando o token
- ✅ **Listar Minhas Salas**: Ver todas as salas que criou
- ✅ **Ver Dados da Sala**: Informações sobre a sala e últimas mensagens

---

## 📁 Estrutura

```
rooms/
├── rooms.controller.ts        # Controllers REST
├── rooms.service.ts           # Lógica de negócio
├── rooms.module.ts            # Module configuration
├── dto/
│   ├── create-room.dto.ts     # DTO para criar sala
│   └── join-room.dto.ts       # DTO para juntar-se à sala
├── repository/
│   └── rooms.repository.ts    # Data access layer
└── README.md                  # Esta documentação
```

---

## 🔌 Endpoints

### 1. POST `/rooms` - Criar Sala

**Autenticação**: Requerida (JWT)

**Descrição**: Cria uma nova sala de chat com um token de convite único

**Request Body**:
```json
{
  "name": "General Chat"
}
```

**Response (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "General Chat",
  "hostId": "user-123",
  "inviteToken": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2026-03-27T10:30:45.000Z",
  "host": {
    "id": "user-123",
    "name": "João",
    "email": "joao@example.com",
    "photo": "https://example.com/photo.jpg"
  }
}
```

**Validações**:
- `name` é obrigatório
- `name` deve ser string
- `name` mínimo 1 caractere
- `name` máximo 50 caracteres

**Erros**:
```json
{
  "statusCode": 400,
  "message": "Room name cannot exceed 50 characters",
  "error": "Bad Request"
}
```

---

### 2. GET `/rooms/invite/:token` - Ver Detalhes da Sala

**Autenticação**: Requerida (JWT)

**Descrição**: Retorna informações sobre uma sala e suas últimas 10 mensagens

**Path Parameters**:
- `token` (UUID): Invite token da sala

**Response (200)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "General Chat",
  "hostId": "user-123",
  "inviteToken": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2026-03-27T10:30:45.000Z",
  "host": {
    "id": "user-123",
    "name": "João",
    "email": "joao@example.com",
    "photo": "https://example.com/photo.jpg"
  },
  "messages": [
    {
      "id": "msg-001",
      "content": "Hello everyone!",
      "createdAt": "2026-03-27T10:31:15.000Z",
      "user": {
        "id": "user-456",
        "name": "Maria",
        "email": "maria@example.com",
        "photo": "https://example.com/photo2.jpg"
      }
    }
  ]
}
```

**Erros**:
```json
{
  "statusCode": 400,
  "message": "Invalid or expired invite token",
  "error": "Bad Request"
}
```

---

### 3. POST `/rooms/join/:token` - Juntar-se a Uma Sala

**Autenticação**: Requerida (JWT)

**Descrição**: Permite que um utilizador se junte a uma sala usando o token de convite

**Path Parameters**:
- `token` (UUID): Invite token da sala

**Response (201)**:
```json
{
  "room": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "General Chat",
    "hostId": "user-123",
    "inviteToken": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2026-03-27T10:30:45.000Z",
    "host": {
      "id": "user-123",
      "name": "João",
      "email": "joao@example.com",
      "photo": "https://example.com/photo.jpg"
    }
  },
  "message": "Successfully joined room: General Chat"
}
```

**Validações**:
- Utilizador não pode juntar-se a sua própria sala
- Token deve ser válido
- Utilizador deve estar autenticado

**Erros**:
```json
{
  "statusCode": 400,
  "message": "You cannot join your own room",
  "error": "Bad Request"
}
```

---

### 4. GET `/rooms/myrooms` - Listar Minhas Salas

**Autenticação**: Requerida (JWT)

**Descrição**: Retorna todas as salas criadas pelo utilizador autenticado

**Response (200)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "General Chat",
    "hostId": "user-123",
    "inviteToken": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2026-03-27T10:30:45.000Z",
    "host": {
      "id": "user-123",
      "name": "João",
      "email": "joao@example.com",
      "photo": "https://example.com/photo.jpg"
    },
    "messages": [
      {
        "id": "msg-001",
        "content": "Hello!",
        "createdAt": "2026-03-27T10:31:15.000Z"
      }
    ]
  }
]
```

---

## 📦 DTOs

### CreateRoomDto

Utilizado para criar uma nova sala.

```typescript
export class CreateRoomDto {
  /**
   * Room name - will be displayed to users
   * @type {string}
   * @minLength 1
   * @maxLength 50
   */
  name: string;
}
```

**Exemplo**:
```json
{
  "name": "Study Group"
}
```

### JoinRoomDto

Utilizado para juntar-se a uma sala (pode ser expandido no futuro).

```typescript
export class JoinRoomDto {
  /**
   * Unique invite token for the room
   * @type {string}
   * @format uuid
   */
  inviteToken: string;
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar Sala e Compartilhar Token

```bash
# 1. Criar sala
curl -X POST http://localhost:3000/rooms \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Study Group"}'

# Response:
# {
#   "id": "room-001",
#   "inviteToken": "550e8400-e29b-41d4-a716-446655440000",
#   ...
# }

# 2. Compartilhar o inviteToken com amigos
# Amigos usam o token para se juntar:

# 3. Outro utilizador junta-se
curl -X POST http://localhost:3000/rooms/join/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer FRIEND_JWT_TOKEN"
```

### Exemplo 2: Listar Minhas Salas

```bash
curl -X GET http://localhost:3000/rooms/myrooms \
  -H "Authorization: Bearer JWT_TOKEN"

# Response:
# [
#   {
#     "id": "room-001",
#     "name": "Study Group",
#     ...
#   },
#   {
#     "id": "room-002",
#     "name": "Gaming",
#     ...
#   }
# ]
```

### Exemplo 3: Ver Detalhes da Sala

```bash
curl -X GET http://localhost:3000/rooms/invite/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer JWT_TOKEN"
```

### Exemplo 4: JavaScript/Node.js

```typescript
// Criar sala
async function createRoom(token: string, name: string) {
  const response = await fetch('http://localhost:3000/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  return response.json();
}

// Juntar-se à sala
async function joinRoom(token: string, inviteToken: string) {
  const response = await fetch(`http://localhost:3000/rooms/join/${inviteToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// Uso
const room = await createRoom(jwtToken, 'My Room');
console.log('Invite Token:', room.inviteToken);

const joined = await joinRoom(friendToken, room.inviteToken);
console.log('Joined:', joined);
```

---

## 🔧 Melhorias Implementadas

### Da Versão Anterior

#### ✅ Corrigido: Dependency Injection

**Antes**:
```typescript
// ❌ ERRADO
export class RoomsController {
    constructor(private service: RoomsRepository){}  // Injetava Repository!
}
```

**Depois**:
```typescript
// ✅ CORRETO
export class RoomsController {
    constructor(private readonly roomsService: RoomsService){}  // Injeta Service
}
```

#### ✅ Adicionado: Type Safety

**Antes**:
```typescript
// ❌ any parameters
async createRoom(data){
    return this.repository.create(data);
}
```

**Depois**:
```typescript
// ✅ Tipado explicitamente
async createRoom(createRoomDto: CreateRoomDto, hostId: string): Promise<Room> {
    // ...
}
```

#### ✅ Adicionado: Error Handling

**Antes**:
```typescript
// ❌ Sem try-catch
async create(data){
    return this.prisma.room.create({ data });
}
```

**Depois**:
```typescript
// ✅ Com tratamento de erros
async create(data: CreateRoomDto, hostId: string): Promise<Room> {
    try {
        // ...
    } catch (error) {
        this.logger.error(`Database error: ${error.message}`);
        throw new InternalServerErrorException(...);
    }
}
```

#### ✅ Adicionado: Logging

Integrado Logger em todas as camadas (Controller, Service, Repository) para facilitar debugging.

#### ✅ Corrigido: Typo

**Antes**: `JoinByEnvite` (typo)
**Depois**: `joinRoom` (correto)

#### ✅ Adicionado: Funcionalidade de Join

Nova rota POST `/rooms/join/:token` para utilizadores se juntarem a salas.

#### ✅ Adicionado: Lista de Minhas Salas

Nova rota GET `/rooms/myrooms` para listar salas do utilizador.

#### ✅ Adicionado: Validação Completa

DTOs com validações robustas:
- @IsString
- @IsNotEmpty
- @MinLength / @MaxLength
- Mensagens de erro customizadas

#### ✅ Adicionado: Segurança

- Verificação de autenticação JWT em todos os endpoints
- Validação de que utilizador não pode juntar-se à sua própria sala
- Separação clara entre host e membros

#### ✅ Adicionado: Documentação

- JSDoc em todos os métodos
- Comentários em DTOs
- README completo

---

## 🔌 Integração com Outros Módulos

### Chat Module

Quando um utilizador envia uma mensagem no WebSocket para uma sala:
1. Valida se o `roomId` corresponde a uma sala válida
2. A mensagem é armazenada com referência ao `roomId`
3. Transmite para todos os clientes nessa sala

### Auth Module

Requer JWT válido em todos os endpoints. O JWT contém:
- `userId`: ID do utilizador
- `email`: Email do utilizador

Usado para identificar quem cria ou junta-se à sala.

---

## 📊 Schema Prisma

```prisma
model Room {
  id          String   @id @default(uuid())
  name        String
  hostId      String
  inviteToken String   @unique
  createdAt   DateTime @default(now())

  host     User      @relation(fields: [hostId], references: [id])
  messages Message[]
}
```

**Relacionamentos**:
- `hostId` → `User.id` (Proprietário da sala)
- `messages` ← `Message.roomId` (Mensagens na sala)

---

## 🚀 Próximas Melhorias

1. **Sair da Sala**: POST `/rooms/:id/leave`
2. **Deletar Sala**: DELETE `/rooms/:id` (apenas host)
3. **Editar Nome**: PATCH `/rooms/:id` (apenas host)
4. **Tabela RoomMembers**: Para rastrear quem entrou em cada sala
5. **Permissões**: Admin/Moderator roles
6. **Banned Users**: Capacidade de banir utilizadores
7. **Notifications**: Notificar quando alguém entra/sai
8. **Room Settings**: Privacidade, descrição, etc

---

## 📝 Testing

Ver [CHAT_TESTING.md](../../CHAT_TESTING.md) para exemplos de testes REST API que se aplicam também ao módulo de rooms.

### Quick Test

```bash
# Criar sala
curl -X POST http://localhost:3000/rooms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Room"}'

# Listar minhas salas
curl -X GET http://localhost:3000/rooms/myrooms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Variáveis de Ambiente

O módulo usa:
- `DATABASE_URL`: Conexão com PostgreSQL
- `FRONTEND_URL`: Para configurar CORS (em outros módulos)

---

**Última atualização**: 27/03/2026
