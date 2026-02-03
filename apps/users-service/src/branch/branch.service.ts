
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { Address } from '../address/entities/address.entity';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { ResponseHelper, PaginatedResponse } from '@/shared/helpers/response.helper';
import { SeedingService } from '../seeding/seeding.service';

@Injectable()
export class BranchService {
    constructor(
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        private readonly seedingService: SeedingService,
    ) { }

    private generateIFSC(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `KB${timestamp.slice(-6)}${random}`;
    }

    async create(createBranchDto: CreateBranchDto) {
        try {
            const ifsc = this.generateIFSC();
            let address: Address | undefined = undefined;

            // Create address if address fields are provided
            if (createBranchDto.addressLine1 || createBranchDto.city) {
                const addressData = this.addressRepository.create({
                    addressLine1: createBranchDto.addressLine1 || '',
                    addressLine2: createBranchDto.addressLine2,
                    landmark: createBranchDto.landmark,
                    city: createBranchDto.city || '',
                    state: createBranchDto.state || '',
                    pincode: createBranchDto.pincode || '',
                    country: createBranchDto.country || 'India',
                    type: 'office'
                });
                address = await this.addressRepository.save(addressData);
            }

            const branch = this.branchRepository.create({
                name: createBranchDto.name,
                ifsc,
                phoneNumber: createBranchDto.phone,
                address
            });
            
            const savedBranch = await this.branchRepository.save(branch);

            // Create branch admin if requested
            if (createBranchDto.createDefaultAdmin && createBranchDto.adminDetails) {
                await this.seedingService.createBranchAdmin(savedBranch.id, createBranchDto.adminDetails);
            }

            const result = await this.branchRepository.findOne({
                where: { id: savedBranch.id },
                relations: ['address']
            });
            return ResponseHelper.success(result, 'Branch created successfully', 201);
        } catch (error) {
            throw new Error(`Failed to create branch: ${error.message}`);
        }
    }

    async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<Branch>> {
        const { page = 1, limit = 10, sortBy, sortOrder, search } = paginationDto;
        const skip = (page - 1) * limit;

        const queryOptions: FindManyOptions<Branch> = {
            skip,
            take: limit,
            order: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'DESC' },
            relations: ['address'],
        };

        if (search) {
            queryOptions.where = [
                { name: Like(`%${search}%`) },
                { ifsc: Like(`%${search}%`) },
            ];
        }

        const [branches, total] = await this.branchRepository.findAndCount(queryOptions);
        return ResponseHelper.paginated(branches, total, page, limit, 'Branches retrieved successfully');
    }

    async findOne(id: string) {
        const branch = await this.branchRepository.findOne({
            where: { id },
            relations: ['address']
        });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        return ResponseHelper.success(branch, 'Branch retrieved successfully');
    }

    async update(id: string, updateBranchDto: UpdateBranchDto) {
        const branch = await this.branchRepository.findOneBy({ id });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        const updateData: Partial<Branch> = {};
        if (updateBranchDto.name) updateData.name = updateBranchDto.name;
        if (updateBranchDto.phone) updateData.phoneNumber = updateBranchDto.phone;

        await this.branchRepository.update(id, updateData);
        const updatedBranch = await this.branchRepository.findOne({
            where: { id },
            relations: ['address']
        });
        return ResponseHelper.success(updatedBranch, 'Branch updated successfully');
    }

    async remove(id: string) {
        const branch = await this.branchRepository.findOneBy({ id });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        await this.branchRepository.delete(id);
        return ResponseHelper.success(null, 'Branch deleted successfully');
    }
}
