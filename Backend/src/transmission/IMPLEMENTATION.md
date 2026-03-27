# Transmission Module - Implementation Guide

## Architecture Overview

The Transmission module implements a real-time, owner-controlled screen sharing control synchronization system using WebSocket technology. The implementation follows the "simplest possible" design, focusing exclusively on control synchronization without video/audio streaming.

## Design Philosophy: Option 1 - Stateless + Map

This implementation was chosen based on the following reasoning:

1. **No Video Streaming**: The server doesn't handle video/file uploads - clients connect peer-to-peer or use external streaming services
2. **Control Synchronization Only**: The server orchestrates play/pause/seek commands between room members
3. **Minimal State**: Only tracks which rooms have active transmissions and who owns them
4. **High Performance**: O(1) lookups for transmission status, no database queries for control operations
5. **Simple Recovery**: On server restart, all transmissions are cleared; clients automatically reconnect

## Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                 TransmissionModule                   │
│  - Exports: TransmissionService                      │
│  - Providers: TransmissionService, Gateway, Prisma   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────────────┐  ┌─────────────────────────┐
│ TransmissionGateway  │  │ TransmissionService     │
│  @WebSocketGateway   │  │  (Business Logic)       │
│  @UseFilters         │  │                         │
│                      │  │  - startTransmission    │
│ Event Handlers:      │  │  - validateBroadcast    │
│  - start             │  │  - stopTransmission     │
│  - broadcast-control │  │  - getStatus            │
│  - stop              │  │  - cleanup              │
│  - get-status        │  │  - getAll (debug)       │
└──────────┬───────────┘  └────────────┬────────────┘
           │                           │
           └───────────┬───────────────┘
                       │
                       ▼
      ┌────────────────────────────────┐
      │  Active Transmissions (Map)     │
      │  Store: { roomId →              │
      │    { roomId, ownerId, ... }     │
      │  }                              │
      └────────────────────────────────┘
```

## Data Flow

### Start Transmission Flow

```
Client (Room Owner)
  │
  ├─ emit('start-transmission', { roomId })
  │
  ▼
TransmissionGateway.handleStartTransmission()
  │
  ├─ Extract userId from socket.data
  ├─ Validate: roomId exists, user is owner
  │
  ▼
TransmissionService.startTransmission()
  │
  ├─ Verify room exists via PrismaService
  ├─ Verify user is room owner (room.hostId === userId)
  ├─ Check no duplicate transmission in Map
  ├─ Create entry: activeTransmissions.set(roomId, {...})
  ├─ Log DEBUG: "Transmission started in room {roomId}"
  │
  ▼ Return transmission object
  │
TransmissionGateway
  │
  ├─ client.join(`transmission:${roomId}`)
  ├─ server.to(roomId).emit('transmission-started', {...})
  ├─ client.emit('transmission-status', { status: 'started' })
  │
  ▼
All Room Members
  │
  ├─ Receive 'transmission-started' event
  ├─ Update UI: Show "Owner is sharing screen"
  └─ Ready to receive broadcast-control commands
```

### Broadcast Control Flow

```
Client (Transmission Owner)
  │
  ├─ emit('broadcast-control', { roomId, action: 'pause', timestamp? })
  │
  ▼
TransmissionGateway.handleBroadcastControl()
  │
  ├─ Extract userId from socket.data
  ├─ Validate: roomId, action provided
  │
  ▼
TransmissionService.validateBroadcastControl()
  │
  ├─ Check transmission exists: activeTransmissions.has(roomId)
  ├─ Verify ownership: transmission.ownerId === userId
  ├─ Validate action: enum ['play', 'pause', 'seek']
  ├─ Validate timestamp (if action is 'seek')
  │
  ▼ Return validated control object
  │
TransmissionGateway
  │
  ├─ server.to(roomId).emit('broadcast-control', {
  │    action, timestamp, sentAt
  │  })
  ├─ client.emit('control-sent', { action, roomId })
  │
  ▼
All Room Members
  │
  ├─ Receive 'broadcast-control' event
  ├─ Synchronize: Play, pause, or seek to timestamp
  └─ Maintain synchronized playback across all clients
```

### Stop Transmission Flow

```
Client (Transmission Owner)
  │
  ├─ emit('stop-transmission', { roomId })
  │
  ▼
TransmissionGateway.handleStopTransmission()
  │
  ├─ Extract userId from socket.data
  ├─ Validate: roomId provided, user authenticated
  │
  ▼
TransmissionService.stopTransmission()
  │
  ├─ Verify transmission exists
  ├─ Verify ownership
  ├─ Remove entry: activeTransmissions.delete(roomId)
  ├─ Log DEBUG & return success
  │
  ▼
TransmissionGateway
  │
  ├─ server.to(roomId).emit('transmission-stopped', { roomId, stoppedAt })
  ├─ client.leave(`transmission:${roomId}`)
  ├─ client.emit('transmission-status', { status: 'stopped' })
  │
  ▼
All Room Members
  │
  ├─ Receive 'transmission-stopped' event
  ├─ Clear UI: Remove "Sharing screen" indicator
  └─ Stop synchronized playback commands
```

### Automatic Cleanup on Disconnect

```
WebSocket Client Disconnects
  │
  ▼
TransmissionGateway.handleDisconnect()
  │
  ├─ Extract userId from socket.data
  ├─ Retrieve all active transmissions via service
  │
  ├─ For each transmission:
  │  ├─ Check: transmission.ownerId === userId
  │  │
  │  ├─ If owner disconnected:
  │  │  ├─ Call cleanupTransmission(roomId)
  │  │  ├─ server.to(roomId).emit('transmission-stopped-by-disconnect')
  │  │  └─ Log cleanup
  │
  ▼
All Room Members (except disconnected)
  │
  ├─ Receive 'transmission-stopped-by-disconnect' event
  └─ UI Update: "Transmission ended - owner disconnected"
```

## State Management

### Active Transmissions Map

```typescript
private activeTransmissions: Map<string, {
  roomId: string;      // UUID - Map key
  ownerId: string;     // UUID of room owner
  isLive: boolean;     // Always true (could be derived)
  startedAt: Date;     // Timestamp of start
}>
```

**Operations:**
- **Create**: `startTransmission()` → `activeTransmissions.set(roomId, {...})`
- **Read**: `getActiveTransmission(roomId)` → `activeTransmissions.get(roomId)`
- **Read All**: `getAllActiveTransmissions()` → `Array.from(activeTransmissions.values())`
- **Delete**: `stopTransmission()` → `activeTransmissions.delete(roomId)`
- **Cleanup**: `cleanupTransmission()` → `activeTransmissions.delete(roomId)`

**Time Complexity:**
- All operations: O(1) average case
- Memory: O(n) where n = number of active rooms with transmission

## Error Handling Strategy

### Validation Hierarchy

1. **Gateway Layer (Input Validation)**
   ```typescript
   if (!data || !data.roomId) {
     throw new BadRequestException('Room ID is required');
   }
   ```

2. **Authentication Check**
   ```typescript
   const userId = client.data?.userId;
   if (!userId) {
     throw new BadRequestException('User not authenticated');
   }
   ```

3. **Service Layer (Business Logic Validation)**
   ```typescript
   // In startTransmission():
   - Verify room exists in database
   - Verify user is room owner
   - Check no duplicate transmission
   
   // In validateBroadcastControl():
   - Verify transmission exists
   - Verify user is transmission owner
   - Validate action and timestamp values
   ```

### Exception Types

| Exception | Status | Scenario |
|-----------|--------|----------|
| `BadRequestException` | 400 | Missing required fields, invalid data format |
| `NotFoundException` | 404 | Room not found, transmission not found |
| `ForbiddenException` | 403 | User is not room owner, user is not transmission owner |
| `ConflictException` | 409 | Transmission already active in room |

### Error Response Format

```json
{
  "event": "error",
  "data": {
    "event": "start-transmission",
    "message": "User is not the room owner"
  }
}
```

Handled by `WsExceptionFilter` - catches all exceptions and emits to client.

## Integration Points

### 1. Module Registration

**In `app.module.ts`:**
```typescript
import { TransmissionModule } from './transmission/transmission.module';

@Module({
  imports: [
    // ... existing modules
    TransmissionModule,
  ],
})
export class AppModule {}
```

### 2. PrismaService Dependency

The service uses `PrismaService` to verify:
- Room exists before starting transmission
- User is the room owner (checks `room.hostId`)

```typescript
constructor(private prisma: PrismaService) {}

async startTransmission(dto: StartTransmissionDto, userId: string) {
  const room = await this.prisma.room.findUnique({
    where: { id: dto.roomId },
  });
  
  if (!room) {
    throw new NotFoundException('Room not found');
  }
  
  if (room.hostId !== userId) {
    throw new ForbiddenException('Only room owner can start transmission');
  }
  // ...
}
```

### 3. WebSocket Setup Requirements

The application must provide socket authentication:

```typescript
// In auth guard or authentication middleware:
socket.data.userId = user.id;       // Extract from JWT token
socket.data.roomId = roomId;        // Optional, from URL params
```

### 4. Room Cleanup Integration

When a room is deleted, transmission should be cleaned up:

**In `RoomsService.deleteRoom()` (future enhancement):**
```typescript
await this.transmissionService.cleanupTransmission(roomId);
```

## Logging Strategy

### Log Levels by Operation

| Operation | Level | Content |
|-----------|-------|---------|
| Start Transmission | DEBUG | Request received, validation checks, success |
| Broadcast Control | DEBUG | Action, owner, room, broadcast |
| Stop Transmission | DEBUG | Request, validation, cleanup |
| Get Status | DEBUG | Query, result |
| Disconnect Cleanup | DEBUG | User, transmission cleanup |
| Error | ERROR | Exception type, message, context |

### Example Log Output

```
[TransmissionGateway] debug: Start transmission request for room 123e4567 from user abc789
[TransmissionService] debug: Starting transmission in room 123e4567 for user abc789
[TransmissionGateway] debug: Transmission started in room 123e4567
[TransmissionGateway] debug: Control pause broadcast to room 123e4567
[TransmissionService] debug: Transmission stopped in room 123e4567
[TransmissionGateway] error: Error starting transmission: Only room owner can start transmission
```

### View Logs

```bash
npm run start:debug
# or
npm run start 2>&1 | grep TransmissionGateway
```

## Testing Strategy

### Unit Tests Needed

1. **Service Tests** (`transmission.service.spec.ts`)
   - Test each public method
   - Test error conditions
   - Test Map operations

2. **Gateway Tests** (`transmission.gateway.spec.ts`)
   - Mock socket, service, and server
   - Test each event handler
   - Test disconnect handler

3. **Integration Tests** (`transmission.e2e-spec.ts`)
   - Connect multiple sockets
   - Start transmission
   - Broadcast controls
   - Verify all clients receive events

### E2E Test Scenario

```typescript
describe('Transmission E2E', () => {
  it('should start transmission and broadcast controls', async () => {
    // 1. Create room as owner
    // 2. Connect socket (authenticated as owner)
    // 3. Emit start-transmission event
    // 4. Verify: transmission-started event received
    // 5. Emit broadcast-control with pause
    // 6. Verify: broadcast-control event received with pause action
    // 7. Emit stop-transmission
    // 8. Verify: transmission-stopped event received
  });
});
```

## Performance Analysis

### Scalability Considerations

1. **Memory**: Each active transmission ≈ 150 bytes
   - 1,000 active transmissions ≈ 150KB
   - Acceptable for modern servers

2. **WebSocket Broadcasts**: `server.to(roomId).emit()` uses Socket.io's efficient adapter
   - Linear to room size, not total connections
   - Room with 100 members: broadcast to 100 sockets

3. **Lookups**: O(1) Map operations
   - `startTransmission()`: 1 DB query + 1 Map set
   - `validateBroadcastControl()`: 1 Map get + validation
   - `stopTransmission()`: 1 Map delete

### Optimization Opportunities

1. **Redis Adapter**: For multi-server deployments
   ```typescript
   const io = new Server(httpServer, {
     adapter: createAdapter(pubClient, subClient),
   });
   ```

2. **Database Sync** (future): Store transmission history
   ```typescript
   await this.prisma.transmissionLog.create({
     data: { roomId, ownerId, startedAt, duration }
   });
   ```

3. **Caching**: Cache room ownership checks
   ```typescript
   // Check cache before DB query
   const room = await this.roomCache.get(roomId)
     || await this.prisma.room.findUnique({ where: { id: roomId } });
   ```

## Security Considerations

### Authorization

- ✅ **Ownership Verification**: Only room owner can start/control/stop
- ✅ **Scope Isolation**: Users can only see status of their room
- ✅ **Socket Authentication**: Requires valid JWT token
- ✅ **User Isolation**: Each user identified uniquely via `socket.data.userId`

### Input Validation

- ✅ **UUID Validation**: `roomId` validated with `@IsUUID`
- ✅ **Enum Validation**: `action` validated against allowed values
- ✅ **Type Checking**: TypeScript strict mode enabled
- ✅ **Data Sanitization**: No user input echoed back directly

### DoS Prevention

- 🔄 **Rate Limiting** (future): Limit events per user per room
- 🔄 **Event Size Limits**: Validate timestamp values
- 🔄 **Connection Limits**: Max active transmissions per user

## Migration & Upgrades

### Version 1 → Version 2 Considerations

The current design allows future enhancements:

1. **Add Message Persistence**: Store events to database
   ```typescript
   await this.prisma.transmissionEvent.create({
     data: { roomId, ownerId, action, timestamp }
   });
   ```

2. **Add QoS Metrics**: Track latency and reliability
   ```typescript
   server.to(roomId).emit('broadcast-control', {
     action, timestamp, 
     requestedAt: Date.now(), // For latency calculation
   });
   ```

3. **Add Multi-Broadcaster**: Remove owner-only restriction
   ```typescript
   // Instead of one owner, maintain a set of active broadcasters
   activeTransmissions.set(roomId, {
     broadcasterIds: new Set([...], [...]),
     isLive: true,
   });
   ```

## Troubleshooting

### Issue: Transmission not starting
- Check: User is authenticated (`socket.data.userId` set)
- Check: User is room owner
- Check: No previous transmission active

### Issue: Control commands not received
- Check: User is transmission owner
- Check: Room members are connected to correct namespace
- Check: WebSocket connection is stable

### Issue: Cleanup not working on disconnect
- Check: `handleDisconnect()` is registered
- Check: Logger shows cleanup events
- Check: Other members receive `transmission-stopped-by-disconnect` event

## Code Quality Metrics

- **TypeScript Strict Mode**: ✅ Enabled
- **Null Safety**: ✅ All nullable fields checked
- **Error Handling**: ✅ Try-catch on all async operations
- **Logging**: ✅ DEBUG level for operations, ERROR for exceptions
- **Documentation**: ✅ JSDoc comments on all public methods
- **Type Safety**: ✅ Strong typing on all parameters and returns
