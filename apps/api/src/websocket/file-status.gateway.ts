import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EStatusFile } from '../manager-file/status-file.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FileStatusGateway {
  @WebSocketServer()
  server: Server;

  notifyStatusChange(uploadId: string, status: EStatusFile) {
    this.server.emit(`file-status:${uploadId}`, { status });
  }
}
