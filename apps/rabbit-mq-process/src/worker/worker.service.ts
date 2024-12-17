import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class WorkerService {
  async saveData(): Promise<void> {
    const numThreads = 6; // Número de threads
    const workers = [];

    for (let i = 0; i < numThreads; i++) {
      const dir = path.join(__dirname, './worker-file.ts');
      console.log(dir);

      const worker = new Worker(dir);
      worker.on('message', (message) => {
        console.log(`Worker retornou: ${message}`);
      });

      worker.on('error', (error) => {
        console.error(`Worker erro:`, error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker finalizou com código de saída ${code}`);
        }
      });

      workers.push(worker);
    }

    for (let i = 0; i < numThreads; i++) {
      workers[i].postMessage(i);
    }
  }
}
