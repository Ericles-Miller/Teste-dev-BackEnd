import { Test, TestingModule } from '@nestjs/testing';
import { ManagerFileService } from './manager-file.service';

describe('ManagerFileService', () => {
  let service: ManagerFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerFileService],
    }).compile();

    service = module.get<ManagerFileService>(ManagerFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
