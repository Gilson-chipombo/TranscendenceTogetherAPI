# Transmission Module

Real-time screen sharing control synchronization module for the Together application.

## Overview

The Transmission module manages WebSocket-based communication for synchronized screen sharing within rooms. It provides owner-controlled broadcasting of screen sharing commands (play, pause, seek) to all room members in real-time, without handling video/audio streaming itself.

## Key Features

- **Owner-Based Control**: Only the room owner can start, control, and stop transmissions
- **Real-Time Control Synchronization**: Broadcast play, pause, and seek commands to all room members
- **Automatic Cleanup**: Transmissions automatically stop when the owner disconnects
- **Stateless Design**: Uses in-memory Map for temporary transmission state; syncing with database is optional
- **Proper Error Handling**: Validates all inputs and provides meaningful error messages
- **Comprehensive Logging**: DEBUG level logging for all operations for troubleshooting

## WebSocket Events

### 1. `start-transmission`

Initiates screen sharing in a room. Only the room owner can start a transmission.

**Client → Server:**

```json
{
  "roomId": "uuid-of-room"
}
```

**Server → Room Members:**

```json
{
  "event": "transmission-started",
  "data": {
    "roomId": "uuid-of-room",
    "ownerId": "uuid-of-owner",
    "startedAt": "2025-03-16T14:23:45Z"
  }
}
```

**Validation:**
- Room ID must be a valid UUID
- User must be authenticated
- User must be the room owner
- No transmission must already be active in the room

**Errors:**
- `400 Bad Request`: Missing room ID or user not authenticated
- `404 Not Found`: Room does not exist
- `403 Forbidden`: User is not the room owner
- `409 Conflict`: Transmission already active in the room

### 2. `broadcast-control`

Sends control commands (play, pause, seek) to all room members. Only the transmission owner can send commands.

**Client → Server:**

```json
{
  "roomId": "uuid-of-room",
  "action": "play|pause|seek",
  "timestamp": 125.5
}
```

**Parameters:**
- `roomId` (required, UUID): Target room
- `action` (required, enum): Control command
  - `play`: Resume playback
  - `pause`: Pause playback
  - `seek`: Jump to specific timestamp
- `timestamp` (optional, number): For `seek` actions, the target time in seconds

**Server → Room Members:**

```json
{
  "event": "broadcast-control",
  "data": {
    "action": "play|pause|seek",
    "timestamp": 125.5,
    "sentAt": "2025-03-16T14:23:50Z"
  }
}
```

**Validation:**
- Room ID and action must be provided
- User must be authenticated
- User must be the transmission owner
- Action must be one of: `play`, `pause`, `seek`
- Timestamp must be a non-negative number (if provided)

**Errors:**
- `400 Bad Request`: Missing required fields or invalid data
- `404 Not Found`: No active transmission in the room
- `403 Forbidden`: User is not the transmission owner

### 3. `stop-transmission`

Ends transmission in a room. Only the transmission owner can stop it.

**Client → Server:**

```json
{
  "roomId": "uuid-of-room"
}
```

**Server → Room Members:**

```json
{
  "event": "transmission-stopped",
  "data": {
    "roomId": "uuid-of-room",
    "stoppedAt": "2025-03-16T14:23:55Z"
  }
}
```

**Validation:**
- Room ID must be provided
- User must be authenticated
- User must be the transmission owner
- A transmission must be active in the room

**Errors:**
- `400 Bad Request`: Missing room ID or user not authenticated
- `404 Not Found`: Room does not exist or no active transmission
- `403 Forbidden`: User is not the transmission owner

### 4. `get-transmission-status`

Queries the current transmission status in a room.

**Client → Server:**

```json
{
  "roomId": "uuid-of-room"
}
```

**Server → Client:**

```json
{
  "event": "transmission-status",
  "data": {
    "roomId": "uuid-of-room",
    "isActive": true,
    "ownerId": "uuid-of-owner",
    "startedAt": "2025-03-16T14:23:45Z"
  }
}
```

**When No Transmission is Active:**

```json
{
  "event": "transmission-status",
  "data": {
    "roomId": "uuid-of-room",
    "isActive": false,
    "ownerId": null,
    "startedAt": null
  }
}
```

**Validation:**
- Room ID must be provided
- No authorization check (any authenticated user can query status)

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Client Application                     │
│  (Browser with WebSocket connection to room namespace)   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴─────────────┐
         │                         │
         ▼                         ▼
    ┌────────────┐          ┌──────────────┐
    │   Owner    │          │   Members    │
    │  (Socket)  │          │  (Sockets)   │
    └─────┬──────┘          └───────┬──────┘
          │                         │
          │ start-transmission      │
          ├────────────────────────▶│ (WsExceptionFilter)
          │                         │
          ▼                         ▼
    ┌─────────────────────────────────────┐
    │   TransmissionGateway (@UseFilters) │
    │  • handleStartTransmission()         │
    │  • handleBroadcastControl()          │
    │  • handleStopTransmission()          │
    │  • handleGetTransmissionStatus()     │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │   TransmissionService                │
    │  • startTransmission()                │
    │  • validateBroadcastControl()         │
    │  • stopTransmission()                 │
    │  • getActiveTransmission()            │
    │  • cleanupTransmission()              │
    └──────────────┬───────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │   Active Transmissions (Map)          │
    │   {roomId → {ownerId, startedAt, ...} │
    └──────────────┬───────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │   Broadcast to Room Members          │
    │   server.to(roomId).emit(...)         │
    └──────────────────────────────────────┘
         │
         ▼
    ┌────────────────────────────────────┐
    │  Synchronized Control Updates       │
    │  • transmission-started             │
    │  • broadcast-control                │
    │  • transmission-stopped             │
    └────────────────────────────────────┘
```

## Data Models

### Active Transmission State

```typescript
{
  roomId: string;        // UUID of the room
  ownerId: string;       // UUID of the transmission owner (room host)
  isLive: boolean;       // Whether transmission is currently active
  startedAt: Date;       // Timestamp when transmission started
}
```

## Architecture

### Three-Layer Pattern

1. **Gateway Layer** (`TransmissionGateway`)
   - Receives WebSocket events
   - Handles input validation and error management
   - Broadcasts results to room members using Socket.io

2. **Service Layer** (`TransmissionService`)
   - Implements business logic
   - Validates authorization (owner-only operations)
   - Manages active transmission state
   - Provides logging and error handling

3. **Data Layer**
   - Temporary in-memory state (active transmissions Map)
   - Optional: Sync with database for persistence across server restarts

## Integration

The Transmission module is integrated into the application through the following:

1. **Module Registration** in `app.module.ts`:
   ```typescript
   TransmissionModule,
   ```

2. **Room Integration**: The transmission module is seamlessly integrated with the Rooms module:
   - Transmissions are tied to specific rooms
   - Only room owners can manage transmissions
   - Transmission cleanup occurs automatically on room deletion

3. **WebSocket Authentication**: Requires Socket.io authentication middleware:
   - `socket.data.userId` must be populated with the user's ID
   - `socket.data.roomId` (optional) can be used for optimization

## Error Handling

All errors are caught by the `WsExceptionFilter` and returned to the client with:

```json
{
  "event": "error",
  "data": {
    "event": "event-name",
    "message": "Error message describing what went wrong"
  }
}
```

Common error messages:
- `Room ID is required`
- `User not authenticated`
- `User is not the room owner`
- `No active transmission in this room`
- `Transmission already active in this room`

## Example Client Usage

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'jwt-token-here'
  }
});

// Start transmission
socket.emit('start-transmission', { roomId: 'room-uuid' }, (response) => {
  if (response.error) {
    console.error('Failed to start transmission:', response.error);
  }
});

// Listen for transmission started
socket.on('transmission-started', (data) => {
  console.log('Transmission started:', data);
});

// Broadcast control
socket.emit('broadcast-control', {
  roomId: 'room-uuid',
  action: 'pause'
});

// Listen for control updates
socket.on('broadcast-control', (data) => {
  console.log('Control update:', data.action);
});

// Stop transmission
socket.emit('stop-transmission', { roomId: 'room-uuid' });

// Listen for transmission stopped
socket.on('transmission-stopped', (data) => {
  console.log('Transmission ended');
});

// Query status
socket.emit('get-transmission-status', { roomId: 'room-uuid' });

socket.on('transmission-status', (data) => {
  console.log('Is active:', data.isActive);
});
```

## Logging

The module uses DEBUG level logging for operational visibility:

```
debug: [TransmissionGateway] Start transmission request for room uuid-123 from user uuid-456
debug: [TransmissionService] Starting transmission in room uuid-123 for user uuid-456
debug: [TransmissionGateway] Transmission started in room uuid-123
debug: [TransmissionService] Broadcast control validated: action=pause
debug: [TransmissionGateway] Control pause broadcast to room uuid-123
```

Monitor logs during development with: `npm run start:debug`

## Performance Considerations

- **In-Memory State**: Active transmissions are stored in a JavaScript Map for O(1) lookup
- **WebSocket Broadcasts**: Uses Socket.io's `server.to(roomId).emit()` for efficient room-scoped messaging
- **Stateless Design**: No database queries required for transmission control operations
- **Automatic Cleanup**: Disconnects and stopped transmissions are immediately cleaned up from memory

## Future Enhancements

1. **Persistence**: Sync transmission history to database for analytics
2. **Transmission Recording Metadata**: Store which users participated and duration
3. **Quality of Service**: Monitor and report network latency for control commands
4. **Access Control**: Allow room owner to grant/revoke transmission privileges to other users
5. **Multi-Transmitter Support**: Allow multiple simultaneous transmissions in a room from different owners
