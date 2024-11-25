import { Test, TestingModule } from '@nestjs/testing';
import { ManagerFileController } from './Manager-file.controller';
import { ManagerFileService } from './Manager-file.service';

describe('ManagerFileController', () => {
  let controller: ManagerFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerFileController],
      providers: [ManagerFileService],
    }).compile();

    controller = module.get<ManagerFileController>(ManagerFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
