import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqController } from './rabbit-mq.controller';
import { RabbitMqService } from './rabbit-mq.service';

describe('RabbitMqController', () => {
  let rabbitMqController: RabbitMqController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RabbitMqController],
      providers: [RabbitMqService],
    }).compile();

    rabbitMqController = app.get<RabbitMqController>(RabbitMqController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(rabbitMqController.getHello()).toBe('Hello World!');
    });
  });
});
