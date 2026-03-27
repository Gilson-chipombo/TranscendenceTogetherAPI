# Transmission Module - Testing Guide

## Test Strategy Overview

The Transmission module testing covers three levels:

1. **Unit Tests**: Service and Gateway methods in isolation
2. **Integration Tests**: Multiple components working together
3. **End-to-End Tests**: Full WebSocket flows with multiple clients

## Unit Tests

### TransmissionService Unit Tests

Test file: `transmission.service.spec.ts`

```typescript
describe('TransmissionService', () => {
  let service: TransmissionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Mock PrismaService
    const module = await Test.createTestingModule({
      providers: [
        TransmissionService,
        {
          provide: PrismaService,
          useValue: {
            room: { findUnique: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TransmissionService>(TransmissionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('startTransmission', () => {
    it('should start a transmission for room owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: StartTransmissionDto = { roomId };

      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: userId,
        name: 'Test Room',
        // ... other required fields
      } as any);

      // Act
      const result = await service.startTransmission(dto, userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.roomId).toBe(roomId);
      expect(result.ownerId).toBe(userId);
      expect(result.isLive).toBe(true);
    });

    it('should throw if room does not exist', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: StartTransmissionDto = { roomId };

      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.startTransmission(dto, userId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw if user is not room owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const ownerId = '550e8400-e29b-41d4-a716-446655440002';
      const dto: StartTransmissionDto = { roomId };

      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
        // ...
      } as any);

      // Act & Assert
      await expect(service.startTransmission(dto, userId))
        .rejects
        .toThrow(ForbiddenException);
    });

    it('should throw if transmission already active', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: StartTransmissionDto = { roomId };

      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: userId,
        // ...
      } as any);

      // Start first transmission
      await service.startTransmission(dto, userId);

      // Act & Assert - Try to start again
      await expect(service.startTransmission(dto, userId))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('validateBroadcastControl', () => {
    it('should validate broadcast control from transmission owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const ownerId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: BroadcastControlDto = {
        roomId,
        action: 'pause',
        timestamp: undefined,
      };

      // Start transmission first
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
      } as any);
      await service.startTransmission({ roomId }, ownerId);

      // Act
      const result = await service.validateBroadcastControl(dto, ownerId);

      // Assert
      expect(result).toBeDefined();
      expect(result.action).toBe('pause');
    });

    it('should throw if transmission does not exist', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: BroadcastControlDto = {
        roomId,
        action: 'play',
      };

      // Act & Assert
      await expect(service.validateBroadcastControl(dto, userId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw if user is not transmission owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const ownerId = '550e8400-e29b-41d4-a716-446655440001';
      const otherUserId = '550e8400-e29b-41d4-a716-446655440002';
      const dto: BroadcastControlDto = {
        roomId,
        action: 'play',
      };

      // Start transmission as owner
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
      } as any);
      await service.startTransmission({ roomId }, ownerId);

      // Act & Assert - Try to control as different user
      await expect(service.validateBroadcastControl(dto, otherUserId))
        .rejects
        .toThrow(ForbiddenException);
    });

    it('should throw if action is invalid', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const ownerId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: BroadcastControlDto = {
        roomId,
        action: 'unknown' as any,
        timestamp: undefined,
      };

      // Start transmission
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
      } as any);
      await service.startTransmission({ roomId }, ownerId);

      // Act & Assert
      await expect(service.validateBroadcastControl(dto, ownerId))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should validate seek with timestamp', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const ownerId = '550e8400-e29b-41d4-a716-446655440001';
      const dto: BroadcastControlDto = {
        roomId,
        action: 'seek',
        timestamp: 123.45,
      };

      // Start transmission
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
      } as any);
      await service.startTransmission({ roomId }, ownerId);

      // Act
      const result = await service.validateBroadcastControl(dto, ownerId);

      // Assert
      expect(result.action).toBe('seek');
      expect(result.timestamp).toBe(123.45);
    });
  });

  describe('stopTransmission', () => {
    it('should stop transmission for owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';

      // Start transmission first
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: userId,
      } as any);
      await service.startTransmission({ roomId }, userId);

      // Act
      await service.stopTransmission(roomId, userId);

      // Assert
      const transmission = service.getActiveTransmission(roomId);
      expect(transmission).toBeUndefined();
    });

    it('should throw if transmission does not exist', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';

      // Act & Assert
      await expect(service.stopTransmission(roomId, userId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw if user is not transmission owner', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const ownerId = '550e8400-e29b-41d4-a716-446655440001';
      const otherUserId = '550e8400-e29b-41d4-a716-446655440002';

      // Start transmission as owner
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: ownerId,
      } as any);
      await service.startTransmission({ roomId }, ownerId);

      // Act & Assert
      await expect(service.stopTransmission(roomId, otherUserId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('getActiveTransmission', () => {
    it('should return transmission if active', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';

      // Start transmission
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: userId,
      } as any);
      await service.startTransmission({ roomId }, userId);

      // Act
      const result = service.getActiveTransmission(roomId);

      // Assert
      expect(result).toBeDefined();
      expect(result?.roomId).toBe(roomId);
      expect(result?.ownerId).toBe(userId);
    });

    it('should return undefined if no transmission active', () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const result = service.getActiveTransmission(roomId);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('cleanupTransmission', () => {
    it('should remove transmission and return', async () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      const userId = '550e8400-e29b-41d4-a716-446655440001';

      // Start transmission
      jest.spyOn(prisma.room, 'findUnique').mockResolvedValueOnce({
        id: roomId,
        hostId: userId,
      } as any);
      await service.startTransmission({ roomId }, userId);

      // Act
      const result = service.cleanupTransmission(roomId);

      // Assert
      expect(result).toBe(true);
      expect(service.getActiveTransmission(roomId)).toBeUndefined();
    });

    it('should return false if transmission does not exist', () => {
      // Arrange
      const roomId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const result = service.cleanupTransmission(roomId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
```

### TransmissionGateway Unit Tests

Test file: `transmission.gateway.spec.ts`

```typescript
describe('TransmissionGateway', () => {
  let gateway: TransmissionGateway;
  let service: TransmissionService;
  let server: Server;
  let mockSocket: Partial<Socket>;

  beforeEach(async () => {
    // Mock Socket.io server
    server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;

    mockSocket = {
      data: { userId: '550e8400-e29b-41d4-a716-446655440001' },
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransmissionGateway,
        {
          provide: TransmissionService,
          useValue: {
            startTransmission: jest.fn(),
            validateBroadcastControl: jest.fn(),
            stopTransmission: jest.fn(),
            getActiveTransmission: jest.fn(),
            getAllActiveTransmissions: jest.fn(),
            cleanupTransmission: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<TransmissionGateway>(TransmissionGateway);
    service = module.get<TransmissionService>(TransmissionService);
    gateway.server = server as any;
  });

  describe('handleStartTransmission', () => {
    it('should start transmission and broadcast to room', async () => {
      // Arrange
      const dto: StartTransmissionDto = {
        roomId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const transmission = {
        roomId: dto.roomId,
        ownerId: mockSocket.data!.userId,
        isLive: true,
        startedAt: new Date(),
      };

      jest.spyOn(service, 'startTransmission').mockResolvedValueOnce(transmission);

      // Act
      await gateway.handleStartTransmission(dto, mockSocket as Socket);

      // Assert
      expect(service.startTransmission).toHaveBeenCalledWith(dto, mockSocket.data!.userId);
      expect(mockSocket.join).toHaveBeenCalledWith(`transmission:${dto.roomId}`);
      expect(server.to).toHaveBeenCalledWith(dto.roomId);
    });

    it('should emit error if not authenticated', async () => {
      // Arrange
      mockSocket.data = {}; // No userId
      const dto: StartTransmissionDto = {
        roomId: '550e8400-e29b-41d4-a716-446655440000',
      };

      // Act
      await gateway.handleStartTransmission(dto, mockSocket as Socket);

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          event: 'start-transmission',
          message: expect.stringContaining('not authenticated'),
        }),
      );
    });

    it('should emit error if room ID missing', async () => {
      // Arrange
      const dto: any = { roomId: undefined };

      // Act
      await gateway.handleStartTransmission(dto, mockSocket as Socket);

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          event: 'start-transmission',
          message: expect.stringContaining('Room ID'),
        }),
      );
    });
  });

  describe('handleBroadcastControl', () => {
    it('should broadcast control to room members', async () => {
      // Arrange
      const dto: BroadcastControlDto = {
        roomId: '550e8400-e29b-41d4-a716-446655440000',
        action: 'pause',
      };
      const validatedControl = {
        action: 'pause',
        timestamp: undefined,
      };

      jest.spyOn(service, 'validateBroadcastControl').mockResolvedValueOnce(validatedControl as any);

      // Act
      await gateway.handleBroadcastControl(dto, mockSocket as Socket);

      // Assert
      expect(service.validateBroadcastControl).toHaveBeenCalledWith(dto, mockSocket.data!.userId);
      expect(server.to).toHaveBeenCalledWith(dto.roomId);
    });

    it('should emit error if user not owner', async () => {
      // Arrange
      const dto: BroadcastControlDto = {
        roomId: '550e8400-e29b-41d4-a716-446655440000',
        action: 'play',
      };

      jest.spyOn(service, 'validateBroadcastControl').mockRejectedValueOnce(
        new ForbiddenException('Not the transmission owner'),
      );

      // Act
      await gateway.handleBroadcastControl(dto, mockSocket as Socket);

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          event: 'broadcast-control',
        }),
      );
    });
  });

  describe('handleStopTransmission', () => {
    it('should stop transmission and broadcast to room', async () => {
      // Arrange
      const data = { roomId: '550e8400-e29b-41d4-a716-446655440000' };

      jest.spyOn(service, 'stopTransmission').mockResolvedValueOnce(undefined);

      // Act
      await gateway.handleStopTransmission(data, mockSocket as Socket);

      // Assert
      expect(service.stopTransmission).toHaveBeenCalledWith(data.roomId, mockSocket.data!.userId);
      expect(server.to).toHaveBeenCalledWith(data.roomId);
      expect(mockSocket.leave).toHaveBeenCalledWith(`transmission:${data.roomId}`);
    });
  });

  describe('handleDisconnect', () => {
    it('should cleanup transmissions for disconnected owner', () => {
      // Arrange
      const userId = '550e8400-e29b-41d4-a716-446655440001';
      const roomId = '550e8400-e29b-41d4-a716-446655440000';
      mockSocket.data = { userId };

      const transmissions = [
        {
          roomId,
          ownerId: userId,
          isLive: true,
          startedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getAllActiveTransmissions').mockReturnValueOnce(transmissions as any);
      jest.spyOn(service, 'cleanupTransmission').mockReturnValueOnce(true);

      // Act
      gateway.handleDisconnect(mockSocket as Socket);

      // Assert
      expect(service.cleanupTransmission).toHaveBeenCalledWith(roomId);
      expect(server.to).toHaveBeenCalledWith(roomId);
    });
  });
});
```

## Integration Tests

### WebSocket Integration Test

Test file: `transmission.integration.spec.ts`

```typescript
describe('Transmission Integration', () => {
  let app: INestApplication;
  let socket1: io.Socket;
  let socket2: io.Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(3001);
  });

  afterAll(async () => {
    socket1?.disconnect();
    socket2?.disconnect();
    await app.close();
  });

  it('should start transmission and broadcast controls to all members', (done) => {
    // Connect as owner
    socket1 = io('http://localhost:3001', {
      auth: {
        token: 'owner-jwt-token',
      },
    });

    // Connect as member
    socket2 = io('http://localhost:3001', {
      auth: {
        token: 'member-jwt-token',
      },
    });

    const roomId = '550e8400-e29b-41d4-a716-446655440000';
    let transmissionStarted = false;
    let controlBroadcast = false;

    // Owner starts transmission
    socket1.emit('start-transmission', { roomId });

    // Member listens for transmission started
    socket2.on('transmission-started', (data) => {
      expect(data.roomId).toBe(roomId);
      expect(data.ownerId).toBeDefined();
      transmissionStarted = true;

      // Owner broadcasts control
      socket1.emit('broadcast-control', {
        roomId,
        action: 'pause',
      });
    });

    // Member listens for control
    socket2.on('broadcast-control', (data) => {
      expect(data.action).toBe('pause');
      controlBroadcast = true;

      // Owner stops transmission
      socket1.emit('stop-transmission', { roomId });
    });

    // Member listens for transmission stopped
    socket2.on('transmission-stopped', (data) => {
      expect(data.roomId).toBe(roomId);
      expect(transmissionStarted).toBe(true);
      expect(controlBroadcast).toBe(true);

      done();
    });
  });

  it('should reject control from non-owner', (done) => {
    socket1 = io('http://localhost:3001', {
      auth: { token: 'owner-jwt-token' },
    });

    socket2 = io('http://localhost:3001', {
      auth: { token: 'member-jwt-token' },
    });

    const roomId = '550e8400-e29b-41d4-a716-446655440001';

    socket1.emit('start-transmission', { roomId });

    // Member attempts to control (should fail)
    socket2.emit('broadcast-control', {
      roomId,
      action: 'play',
    });

    socket2.on('error', (error) => {
      expect(error.event).toBe('broadcast-control');
      expect(error.message).toContain('not the transmission owner');
      done();
    });
  });
});
```

## End-to-End Test Scenarios

### Scenario 1: Complete Transmission Flow

```typescript
/**
 * Normal transmission workflow:
 * 1. Owner starts transmission
 * 2. Members receive start notification
 * 3. Owner broadcasts controls
 * 4. Members receive and apply controls
 * 5. Owner stops transmission
 * 6. Members receive stop notification
 */
describe('E2E: Complete Transmission Flow', () => {
  it('should execute complete transmission workflow', async () => {
    // Setup: 1 owner socket, 2 member sockets
    // Check initial state: no active transmission
    // Owner: emit start-transmission
    // Check: transmission-started received by all members
    // Owner: emit broadcast-control play
    // Check: broadcast-control received by all members
    // Owner: emit broadcast-control seek 60
    // Check: broadcast-control with timestamp received
    // Owner: emit stop-transmission
    // Check: transmission-stopped received by all
    // Verify: no active transmission in service
  });
});
```

### Scenario 2: Disconnect Cleanup

```typescript
/**
 * Automatic cleanup on owner disconnect:
 * 1. Owner starts transmission
 * 2. Members receive notification
 * 3. Owner disconnects
 * 4. Members receive transmission-stopped-by-disconnect
 */
describe('E2E: Disconnect Cleanup', () => {
  it('should cleanup transmission on owner disconnect', async () => {
    // Setup: 1 owner, 2 members
    // Owner starts transmission
    // Members receive transmission-started
    // Owner calls socket.disconnect()
    // Members receive transmission-stopped-by-disconnect within 1 second
  });
});
```

### Scenario 3: Authorization Checks

```typescript
/**
 * Verify all authorization checks:
 * 1. Non-owner cannot start transmission
 * 2. Non-owner cannot control transmission
 * 3. Non-owner cannot stop transmission
 * 4. Owner actions work
 */
describe('E2E: Authorization Checks', () => {
  it('should enforce owner-only restrictions', async () => {
    // Owner starts transmission (success)
    // Member attempts start (403)
    // Member attempts control (403 or 404)
    // Member attempts stop (403 or 404)
    // Owner controls (success)
    // Owner stops (success)
  });
});
```

## Manual Testing Checklist

### Pre-Integration Testing

- [ ] All unit tests pass: `npm run test transmission`
- [ ] No TypeScript errors: `npm run build`
- [ ] Module imports successfully in app.module.ts
- [ ] No console errors on application startup

### WebSocket Testing with Socket.io Tester

```bash
# Test command to send events
npm run test:e2e -- transmission
```

**Manual WebSocket Testing Steps:**

1. **Start Server**
   ```bash
   npm run start:debug
   ```

2. **Connect First Client (Owner)**
   ```javascript
   const socket1 = io('http://localhost:3000', {
     auth: { token: 'owner-token' }
   });
   socket1.on('connect', () => console.log('Owner connected'));
   ```

3. **Start Transmission**
   ```javascript
   socket1.emit('start-transmission', {
     roomId: '550e8400-e29b-41d4-a716-446655440000'
   });
   socket1.on('transmission-status', (data) => console.log('Status:', data));
   ```

4. **Connect Second Client (Member)**
   ```javascript
   const socket2 = io('http://localhost:3000', {
     auth: { token: 'member-token' }
   });
   socket2.on('transmission-started', (data) => console.log('Started:', data));
   ```

5. **Broadcast Control**
   ```javascript
   socket1.emit('broadcast-control', {
     roomId: '550e8400-e29b-41d4-a716-446655440000',
     action: 'pause'
   });
   socket2.on('broadcast-control', (data) => console.log('Control:', data));
   ```

6. **Stop Transmission**
   ```javascript
   socket1.emit('stop-transmission', {
     roomId: '550e8400-e29b-41d4-a716-446655440000'
   });
   socket2.on('transmission-stopped', (data) => console.log('Stopped:', data));
   ```

## Test Coverage Goals

| Component | Unit | Integration | E2E | Target |
|-----------|------|-------------|-----|--------|
| Service methods | 100% | — | — | ✅ |
| Gateway handlers | 100% | — | — | ✅ |
| Error paths | 100% | 50% | 50% | ✅ |
| WebSocket flows | — | 90% | 90% | ✅ |
| Authorization | 100% | 100% | 100% | ✅ |

**Current Target:** 85% overall coverage

## Continuous Integration

Add to CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Test Transmission Module
  run: |
    npm run test transmission
    npm run test:e2e
    npm run build
```

## Debug Tips

### Check Active Transmissions

```typescript
// Print all active transmissions
const transmissions = transmissionService.getAllActiveTransmissions();
console.log('Active transmissions:', transmissions);
```

### Enable DEBUG Logs

```bash
DEBUG=*:TransmissionGateway npm run start:debug
```

### Test WebSocket Events

Use Socket.io devtools or write logging:

```typescript
socket.on('*', (event, ...args) => {
  console.log('Event received:', event, args);
});
```

## Performance Testing

Load test: Multiple rooms with active transmissions

```javascript
// Pseudocode for load test
const rooms = generateTestRooms(100);
const sockets = [];

// Create 100 sockets, one per room
for (const room of rooms) {
  const socket = io('http://localhost:3000');
  socket.emit('start-transmission', { roomId: room.id });
  sockets.push(socket);
}

// Broadcast controls rapidly
setInterval(() => {
  sockets.forEach((socket, index) => {
    socket.emit('broadcast-control', {
      roomId: rooms[index].id,
      action: 'play',
    });
  });
}, 1000);

// Measure memory usage and event latency
```

Expected: <100ms latency, <150KB memory per 1000 active transmissions
