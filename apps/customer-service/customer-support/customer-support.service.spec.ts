import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSupportService } from './customer-support.service';

describe('CustomerSupportService', () => {
  let service: CustomerSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerSupportService],
    }).compile();

    service = module.get<CustomerSupportService>(CustomerSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
