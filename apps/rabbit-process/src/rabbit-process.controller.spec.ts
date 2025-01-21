import { Test, TestingModule } from '@nestjs/testing';
import { RabbitProcessController } from './rabbit-process.controller';
import { RabbitProcessService } from './rabbit-process.service';

describe('RabbitProcessController', () => {
  let rabbitProcessController: RabbitProcessController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RabbitProcessController],
      providers: [RabbitProcessService],
    }).compile();

    rabbitProcessController = app.get<RabbitProcessController>(RabbitProcessController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rabbitProcessController.getHello()).toBe('Hello World!');
    });
  });
});
