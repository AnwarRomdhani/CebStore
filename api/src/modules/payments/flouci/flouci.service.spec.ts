import { Test, TestingModule } from '@nestjs/testing';
import { FlouciService } from './flouci.service';

describe('FlouciService', () => {
  let service: FlouciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlouciService],
    }).compile();

    service = module.get<FlouciService>(FlouciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
