import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

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

    client.emit('error', error);
  }
}
