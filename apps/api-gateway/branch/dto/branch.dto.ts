import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ 
    example: 'Mumbai Main Branch', 
    description: 'Branch name (must be unique)' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    example: '+91-22-12345678', 
    description: 'Branch phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    example: '123 MG Road', 
    description: 'Address line 1' 
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ 
    example: 'Fort Area', 
    description: 'Address line 2' 
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ 
    example: 'Near Fort Station', 
    description: 'Landmark' 
  })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({ 
    example: 'Mumbai', 
    description: 'City name' 
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ 
    example: 'Maharashtra', 
    description: 'State name' 
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ 
    example: '400001', 
    description: 'Pincode' 
  })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ 
    example: 'India', 
    description: 'Country name' 
  })
  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateBranchDto {
  @ApiPropertyOptional({ 
    example: 'Mumbai Central Branch', 
    description: 'Updated branch name' 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    example: '+91-22-87654321', 
    description: 'Updated phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateAddressDto {
  @ApiProperty({ 
    example: '123 MG Road', 
    description: 'Address line 1' 
  })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional({ 
    example: 'Fort Area', 
    description: 'Address line 2' 
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ 
    example: 'Near Fort Station', 
    description: 'Landmark' 
  })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({ 
    example: 'Mumbai', 
    description: 'City name' 
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ 
    example: 'Maharashtra', 
    description: 'State name' 
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ 
    example: '400001', 
    description: 'Pincode' 
  })
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiProperty({ 
    example: 'India', 
    description: 'Country name' 
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ 
    example: 'office', 
    enum: ['permanent', 'temporary', 'office'],
    description: 'Address type' 
  })
  @IsOptional()
  @IsString()
  type?: string;
}