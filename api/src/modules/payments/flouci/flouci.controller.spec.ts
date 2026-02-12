import { Test, TestingModule } from '@nestjs/testing';
import { FlouciController } from './flouci.controller';

describe('FlouciController', () => {
  let controller: FlouciController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlouciController],
    }).compile();

    controller = module.get<FlouciController>(FlouciController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
