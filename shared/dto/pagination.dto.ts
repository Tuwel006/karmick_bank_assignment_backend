import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100, example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'name' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], example: 'ASC' })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({ example: 'search term' })
  @IsString()
  @IsOptional()
  search?: string;
}