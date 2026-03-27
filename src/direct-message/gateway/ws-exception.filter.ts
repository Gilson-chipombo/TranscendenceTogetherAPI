import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * WebSocket Exception Filter for Direct Message Gateway
 * Catches and properly formats WebSocket exceptions
 */
@Catch(WsException, Error)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : {
            status: 'error',
            message: exception.message || 'Internal server error',
          };

    // Emit error back to client
    client.emit('error', error);
  }
}
