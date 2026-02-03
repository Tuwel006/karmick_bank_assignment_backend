import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'john.doe@example.com', 
    description: 'User email address' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'John', 
    description: 'First name' 
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ 
    example: 'Doe', 
    description: 'Last name' 
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: 'SecurePassword123!', 
    description: 'User password' 
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ 
    example: '+91-98765-43210', 
    description: 'Phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Branch ID' 
  })
  @IsOptional()
  @IsString()
  branchId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    example: 'jane.doe@example.com', 
    description: 'Updated email address' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    example: 'Jane', 
    description: 'Updated first name' 
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ 
    example: 'Smith', 
    description: 'Updated last name' 
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ 
    example: '+91-87654-32109', 
    description: 'Updated phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    example: '550e8400-e29b-41d4-a716-446655440001', 
    description: 'Updated branch ID' 
  })
  @IsOptional()
  @IsString()
  branchId?: string;
}