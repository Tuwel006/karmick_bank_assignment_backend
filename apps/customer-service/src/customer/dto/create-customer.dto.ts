import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, IsUUID, Length, Matches } from 'class-validator';
import { CustomerType, KYCStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
    @IsUUID()
    userId: string;

    @IsEnum(CustomerType)
    @IsOptional()
    customerType?: CustomerType;

    @IsString()
    @Length(1, 100)
    firstName: string;

    @IsString()
    @Length(1, 100)
    @IsOptional()
    middleName?: string;

    @IsString()
    @Length(1, 100)
    lastName: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsString()
    @Length(10, 10)
    @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number format' })
    @IsOptional()
    panNumber?: string;

    @IsString()
    @Length(12, 12)
    @Matches(/^[0-9]{12}$/, { message: 'Invalid Aadhar number format' })
    @IsOptional()
    aadharNumber?: string;

    @IsEnum(KYCStatus)
    @IsOptional()
    kycStatus?: KYCStatus;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    pincode?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    alternatePhone?: string;

    @IsEmail()
    @IsOptional()
    alternateEmail?: string;

    @IsString()
    @IsOptional()
    occupation?: string;

    @IsString()
    @IsOptional()
    annualIncome?: string;
}
