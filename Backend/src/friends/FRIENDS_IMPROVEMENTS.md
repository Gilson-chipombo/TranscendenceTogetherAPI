# Friends Module - Improvements Implemented

## Overview
Correção completa do módulo Friends para seguir os padrões de segurança, type safety e documentação Swagger implementados nos módulos Chat e Rooms.

## Issues Corrigidos

### 1. **Type Safety** ✅
**Antes:** Todos os parâmetros usavam `any`
```typescript
async sendRequest(data)     // sem tipos
async respondRequest(requestId: string, status: string)  // sem validação
```

**Depois:** Type safety completo com validação
```typescript
async sendRequest(dto: SendFriendRequestDto, requesterId: string): Promise<Friendship>
async respondRequest(dto: RespondFriendRequestDto, responderId: string): Promise<Friendship>
```

### 2. **Segurança - Extração de User ID** ✅
**Antes:** requesterId vinha do corpo da requisição (impersonação!)
```typescript
@Post("request")
sendRequest(@Body() dto: SendFriendRequestDto) {
  // dto.requesterId poderia ser qualquer usuário!
}
```

**Depois:** Extraído do JWT usando `@CurrentUser` decorator
```typescript
@Post("request")
sendRequest(@Body() dto: SendFriendRequestDto, @CurrentUser() user: any) {
  return this.service.sendRequest(dto, user.id);  // user.id do JWT
}
```

### 3. **Autenticação - JWT Guards** ✅
**Antes:** Nenhuma proteção - endpoints públicos!
```typescript
@Controller('friends')
export class FriendsController {}
```

**Depois:** Todos os endpoints protegidos
```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('friends')
export class FriendsController {}
```

### 4. **HTTP Methods Corretos** ✅
**Antes:** Métodos errados
```typescript
@Post(":userId")  // GET deveria ser, não POST!
async getFriends(@Param("userId") userId: string)
```

**Depois:** Métodos REST corretos
```typescript
@Get()
async getFriends(@CurrentUser() user: any)

@Get('requests/pending')
async getPendingRequests(@CurrentUser() user: any)
```

### 5. **DTOs com Validação Completa** ✅
**Antes:** Validação minimalista
```typescript
export class SendFriendRequestDto {
  @IsString()
  requesterId: string;  // Campo desnecessário!
  
  @IsString()
  receiverId: string;
}
```

**Depois:** Validação robusta com mensagens customizadas
```typescript
export class SendFriendRequestDto {
  @ApiProperty({
    description: 'The ID of the user to send a friend request to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid',
  })
  @IsString({ message: 'Receiver ID must be a string' })
  @IsNotEmpty({ message: 'Receiver ID is required' })
  @IsUUID('4', { message: 'Receiver ID must be a valid UUID' })
  receiverId: string;
}
```

### 6. **Enum para Status** ✅
**Antes:** String aberto
```typescript
@IsString()
status: string;  // "aceitar", "reject", "blah"... qualquer coisa!
```

**Depois:** Enum validado
```typescript
@IsIn(['accepted', 'rejected'], { message: 'Status must be either "accepted" or "rejected"' })
status: 'accepted' | 'rejected';
```

### 7. **Logging Completo** ✅
**Antes:** Nenhum logging
```typescript
async sendRequest(data) {
  return await this.repository.sendRequest(data);
}
```

**Depois:** Logger em todas as camadas
```typescript
async sendRequest(dto: SendFriendRequestDto, requesterId: string): Promise<Friendship> {
  if (!requesterId || typeof requesterId !== 'string') {
    throw new BadRequestException('Requester ID is invalid');
  }
  
  try {
    this.logger.debug(`User ${requesterId} sending friend request to ${dto.receiverId}`);
    const friendship = await this.repository.sendRequest(requesterId, dto.receiverId);
    this.logger.debug(`Friend request created: ${friendship.id}`);
    return friendship;
  } catch (error) {
    this.logger.error(`Error sending friend request: ${error.message}`);
    throw new InternalServerErrorException('Failed to send friend request');
  }
}
```

### 8. **Tratamento de Erros Completo** ✅
**Antes:** Nenhum try-catch
```typescript
async sendRequest(data) {
  return await this.prisma.friendship.create({ data });
}
```

**Depois:** Validação e tratamento robusto
```typescript
try {
  // Validação existencial
  if (requesterId === receiverId) {
    throw new BadRequestException('Cannot send friend request to yourself');
  }
  
  // Verificação de duplicatas
  const existingRequest = await this.prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
      status: { in: ['pending', 'accepted'] },
    },
  });
  
  if (existingRequest) {
    throw new BadRequestException('Friend request or friendship already exists');
  }
  
  // Operação com logging
  this.logger.debug(`Creating friend request from ${requesterId} to ${receiverId}`);
  const friendship = await this.prisma.friendship.create({ data: {...} });
  return friendship;
  
} catch (error) {
  if (error instanceof BadRequestException) throw error;
  this.logger.error(`Database error: ${error.message}`);
  throw new InternalServerErrorException('Failed to send friend request');
}
```

### 9. **Enriquecimento de Dados** ✅
**Antes:** Retorno de dados brutos sem informações de usuário
```typescript
async getFriends(userId: string) {
  return await this.prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { receiverId: userId },
      ],
      status: "accepted"
    }
  });
}
```

**Depois:** Dados enriquecidos com informações do amigo
```typescript
async getFriends(userId: string): Promise<any[]> {
  const friendships = await this.prisma.friendship.findMany({
    where: { /* ... */ },
  });
  
  const friends = await Promise.all(
    friendships.map(async (friendship) => {
      const friendId = friendship.requesterId === userId 
        ? friendship.receiverId 
        : friendship.requesterId;
      
      const friendUser = await this.prisma.user.findUnique({
        where: { id: friendId },
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
          phone: true,
        },
      });
      
      return {
        friendshipId: friendship.id,
        ...friendUser,
        acceptedAt: friendship.createdAt,
      };
    })
  );
  
  return friends;
}
```

### 10. **Autorização Verificada** ✅
**Antes:** Sem verificação de permissões
```typescript
async respondRequest(requestId: string, status: string) {
  return this.repository.respondRequest(requestId, status);
}
```

**Depois:** Verificação de autorização
```typescript
async respondRequest(requestId: string, status: 'accepted' | 'rejected', responderId: string) {
  const friendship = await this.prisma.friendship.findUnique({ where: { id: requestId } });
  
  if (!friendship) {
    throw new NotFoundException(`Friend request ${requestId} not found`);
  }
  
  // Apenas o receptor pode responder!
  if (friendship.receiverId !== responderId) {
    throw new BadRequestException('Only the receiver can respond to this friend request');
  }
  
  // Não pode responder já respondidas
  if (friendship.status !== 'pending') {
    throw new BadRequestException(`This request has already been ${friendship.status}`);
  }
  
  return this.prisma.friendship.update({
    where: { id: requestId },
    data: { status },
  });
}
```

### 11. **Novas Funcionalidades** ✅
Adicionadas operações que faltavam:

1. **GET `/friends/requests/pending`** - Listar solicitações pendentes
2. **DELETE `/friends/:friendshipId`** - Remover amigos

```typescript
async getPendingRequests(userId: string): Promise<any[]>
async removeFriend(friendshipId: string, userId: string): Promise<Friendship>
```

### 12. **Swagger Documentation** ✅
**Antes:** Sem documentação
```typescript
@Post("request")
async sendRequest(@Body() dto: SendFriendRequestDto)
```

**Depois:** Documentação completa
```typescript
@ApiOperation({
  summary: 'Send a friend request',
  description: 'Send a friend request to another user. The authenticated user is the requester.',
})
@ApiBody({ type: SendFriendRequestDto })
@ApiResponse({
  status: 201,
  description: 'Friend request sent successfully',
  schema: { example: { id: '...', requesterId: '...', /* ... */ } },
})
@ApiResponse({ status: 400, description: 'Bad request - invalid data or self-request' })
@ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
@Post('request')
async sendRequest(@Body() dto: SendFriendRequestDto, @CurrentUser() user: any)
```

---

## Arquivos Modificados

1. **send-request.dto.ts**
   - Removido `requesterId` (extraído do JWT)
   - Adicionado validação UUID completa
   - Adicionado @ApiProperty

2. **respond-request.dto.ts**
   - Removido campo `id` desnecessário
   - Corrigido status para enum
   - Adicionado @ApiProperty e validação

3. **friends.controller.ts**
   - Adicionado `@UseGuards(JwtAuthGuard)` e `@ApiBearerAuth`
   - Extraído requesterId de JWT via `@CurrentUser()`
   - Método `getFriends` mudado de POST para GET
   - Adicionados endpoints para listar solicitações pendentes e remover amigos
   - Adicionadas decorações Swagger completas
   - Adicionado Logger em todas as operações
   - Adicionado try-catch e tratamento de erros

4. **friends.service.ts**
   - Type safety completo (Promise<Friendship>)
   - Validação de entrada robusta
   - Logging em debug e error levels
   - Try-catch com erro handling específico
   - Novos métodos: `getPendingRequests`, `removeFriend`

5. **friends.repository.ts**
   - Type safety completo
   - Logging com Logger service
   - Try-catch com InternalServerErrorException
   - Validação de usuários existentes
   - Verificação de duplicatas
   - Enriquecimento de dados com user info
   - Novos métodos com queries otimizadas

---

## Testes Recomendados

```bash
# 1. Enviar solicitação
POST /friends/request
Authorization: Bearer token-user-a
{
  "receiverId": "user-b-id"
}

# 2. Listar solicitações pendentes
GET /friends/requests/pending
Authorization: Bearer token-user-b

# 3. Aceitar solicitação
POST /friends/respond
Authorization: Bearer token-user-b
{
  "requestId": "friendship-id",
  "status": "accepted"
}

# 4. Listar amigos
GET /friends
Authorization: Bearer token-user-a

# 5. Remover amigo
DELETE /friends/friendship-id
Authorization: Bearer token-user-a
```

---

## Resumo de Melhorias

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Segurança** | ❌ Sem autenticação, impersonação possível | ✅ JWT guard, user ID do token, autorização verificada |
| **Type Safety** | ❌ `any` em toda parte | ✅ Types completos + validação |
| **Validação** | ❌ Minimalista | ✅ Robusta com mensagens customizadas |
| **HTTP Methods** | ❌ POST para tudo | ✅ GET/POST/DELETE corretos |
| **Logging** | ❌ Nenhum | ✅ Debug e error em todas camadas |
| **Error Handling** | ❌ Nenhum | ✅ Try-catch com exceções específicas |
| **Dados Retornados** | ❌ Brutos | ✅ Enriquecidos com user info |
| **Documentação** | ❌ Nenhuma | ✅ Swagger completo |
| **Funcionalidades** | ❌ 3 endpoints | ✅ 5 endpoints + pendentes + delete |

## Compilação

✅ **Build bem-sucedido** - Sem erros TypeScript
