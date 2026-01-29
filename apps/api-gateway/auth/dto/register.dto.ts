import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@/utils/constants/roles.enum';

export class RegisterDto {
    @ApiProperty({
        example: 'johndoe',
        description: 'Unique username',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'john@example.com',
        description: 'User email address',
        required: true
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: 'password123',
        minLength: 6,
        description: 'User password (min 6 characters)',
        required: true
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({
        example: '1234567890',
        required: false,
        description: 'User phone number'
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        enum: UserRole,
        required: false,
        example: UserRole.CUSTOMER,
        description: 'User role (customer, staff, etc.)'
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
