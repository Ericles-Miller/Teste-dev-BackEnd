import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqProcessController } from './rabbit-mq-process.controller';
import { RabbitMqProcessService } from './rabbit-mq-process.service';

describe('RabbitMqProcessController', () => {
  let rabbitMqProcessController: RabbitMqProcessController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RabbitMqProcessController],
      providers: [RabbitMqProcessService],
    }).compile();

    rabbitMqProcessController = app.get<RabbitMqProcessController>(RabbitMqProcessController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rabbitMqProcessController.getHello()).toBe('Hello World!');
    });
  });
});
