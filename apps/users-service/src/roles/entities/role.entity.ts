import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // e.g. 'ADMIN', 'MANAGER', 'CUSTOMER'

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => User, (user) => user.roleEntity)
    users: User[];

    @OneToMany(() => Permission, (permission) => permission.role)
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
