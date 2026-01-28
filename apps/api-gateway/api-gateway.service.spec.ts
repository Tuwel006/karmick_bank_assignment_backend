import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayService } from './api-gateway.service';

describe('ApiGatewayService', () => {
  let service: ApiGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiGatewayService],
    }).compile();

    service = module.get<ApiGatewayService>(ApiGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
