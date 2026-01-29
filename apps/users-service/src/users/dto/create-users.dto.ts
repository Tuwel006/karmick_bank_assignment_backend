import { UserRole } from '@/utils/constants/roles.enum';

export class CreateUsersDto {
    username: string;
    email: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
}
