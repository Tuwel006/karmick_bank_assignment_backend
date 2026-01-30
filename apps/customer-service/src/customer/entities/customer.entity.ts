import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum CustomerType {
    INDIVIDUAL = 'INDIVIDUAL',
    BUSINESS = 'BUSINESS',
}

export enum KYCStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
}

@Entity({ name: 'customers' })
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    userId: string; // Reference to users.id

    @Column({ type: 'enum', enum: CustomerType, default: CustomerType.INDIVIDUAL })
    customerType: CustomerType;

    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    middleName?: string;

    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender?: string; // 'MALE', 'FEMALE', 'OTHER'

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    panNumber?: string; // PAN card number for KYC

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    aadharNumber?: string; // Aadhar number for KYC

    @Column({ type: 'enum', enum: KYCStatus, default: KYCStatus.PENDING })
    kycStatus: KYCStatus;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state?: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pincode?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    country?: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    alternatePhone?: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    alternateEmail?: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    occupation?: string;

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    annualIncome?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
