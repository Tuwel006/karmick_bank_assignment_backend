import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { BankAccount } from '../../../../accounts-service/src/accounts/entities/bank-account.entity';

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED'
}

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  customerNumber: string; // Auto-generated unique customer ID

  // Personal Information
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: MaritalStatus, default: MaritalStatus.SINGLE })
  maritalStatus: MaritalStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  annualIncome?: number;

  // Contact Information
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  alternatePhone?: string;

  // Identity Documents
  @Column({ type: 'varchar', length: 20, nullable: true })
  aadharNumber?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  panNumber?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  passportNumber?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  drivingLicenseNumber?: string;

  // Banking Information
  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @Column({ type: 'enum', enum: KYCStatus, default: KYCStatus.NOT_STARTED })
  kycStatus: KYCStatus;

  @Column({ type: 'timestamptz', nullable: true })
  kycVerifiedAt?: Date;

  @Column({ type: 'text', nullable: true })
  kycRemarks?: string;

  // Emergency Contact
  @Column({ type: 'varchar', length: 200, nullable: true })
  emergencyContactName?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  emergencyContactPhone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactRelation?: string;

  // Document Storage
  @Column({ type: 'jsonb', nullable: true })
  documents?: {
    profilePhoto?: string;
    aadharCard?: string;
    panCard?: string;
    passport?: string;
    drivingLicense?: string;
    signature?: string;
    addressProof?: string;
    incomeProof?: string;
  };

  // Relations
  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid', nullable: true })
  permanentAddressId?: string;

  @Column({ type: 'uuid', nullable: true })
  currentAddressId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => BankAccount, (account) => account.customer)
  accounts: BankAccount[];

  @UpdateDateColumn()
  updatedAt: Date;
}