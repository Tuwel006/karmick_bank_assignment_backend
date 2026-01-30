import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '@/utils/constants/roles.enum';
import { Branch } from '../../branch/entities/branch.entity';
import { Role as RoleEntity } from '../../roles/entities/role.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
    phone?: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
    email?: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    username?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    passwordHash?: string;

    @Column({ type: 'boolean', default: false })
    isPhoneVerified: boolean;

    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({ type: 'varchar', length: 20, nullable: true })
    customerId?: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'timestamptz', nullable: true })
    lastLoginAt?: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => Branch, (branch) => branch.users, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

    @Column({ nullable: true })
    branchId: string;

    @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: true })
    @JoinColumn({ name: 'role_id' })
    roleEntity: RoleEntity;

    @Column({ nullable: true })
    roleId: string;
}
