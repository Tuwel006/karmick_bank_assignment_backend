import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
// Note: BankAccount is in a different service/module, usually we don't import entities cross-service directly 
// unless using a shared library or monorepo structure where we accept coupling.
// For now, we are designing the Branch entity itself. We may need to loosely couple BankAccount.

@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true, length: 11 })
    ifsc: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @OneToMany(() => User, (user) => user.branch)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
