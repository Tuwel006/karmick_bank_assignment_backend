import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';

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

    @Column({ type: 'varchar', length: 255, nullable: true })
    passwordHash?: string;

    @Column({ type: 'boolean', default: false })
    isPhoneVerified: boolean;

    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({ type: 'varchar', length: 20, nullable: true })
    customerId?: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'timestamptz', nullable: true })
    lastLoginAt?: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
