import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSupportController } from './customer-support.controller';
import { CustomerSupportService } from './customer-support.service';

describe('CustomerSupportController', () => {
  let controller: CustomerSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerSupportController],
      providers: [CustomerSupportService],
    }).compile();

    controller = module.get<CustomerSupportController>(CustomerSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
