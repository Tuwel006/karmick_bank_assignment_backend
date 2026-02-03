import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchAdminDto {
  @ApiProperty({ example: 'admin@branch.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John', description: 'Admin first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Admin last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Admin password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

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

  @ApiPropertyOptional({ 
    example: false, 
    description: 'Create default admin for this branch' 
  })
  @IsOptional()
  @IsBoolean()
  createDefaultAdmin?: boolean;

  @ApiPropertyOptional({ 
    type: CreateBranchAdminDto,
    description: 'Admin details (required if createDefaultAdmin is true)' 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBranchAdminDto)
  adminDetails?: CreateBranchAdminDto;
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