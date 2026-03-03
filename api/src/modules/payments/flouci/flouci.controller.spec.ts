import { Test, TestingModule } from '@nestjs/testing';
import { FlouciController } from './flouci.controller';
import { FlouciService } from './flouci.service';
import { FlouciWebhookService } from './flouci.webhook.service';

describe('FlouciController', () => {
  let controller: FlouciController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlouciController],
      providers: [
        {
          provide: FlouciService,
          useValue: {},
        },
        {
          provide: FlouciWebhookService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FlouciController>(FlouciController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
