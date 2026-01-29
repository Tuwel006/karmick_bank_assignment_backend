import { UserRole } from '@/utils/constants/roles.enum';

export class CreateUsersDto {
    username?: string;
    email: string;
    passwordHash?: string;
    role?: any;
    phone?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    customerId?: string;
    status?: any;
}
