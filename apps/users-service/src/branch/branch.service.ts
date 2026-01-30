
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchService {
    constructor(
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
    ) { }

    create(createBranchDto: any) {
        const branch = this.branchRepository.create(createBranchDto);
        return this.branchRepository.save(branch);
    }

    findAll() {
        return this.branchRepository.find();
    }

    findOne(id: string) {
        return this.branchRepository.findOneBy({ id });
    }

    update(id: string, updateBranchDto: any) {
        return this.branchRepository.update(id, updateBranchDto);
    }

    remove(id: string) {
        return this.branchRepository.delete(id);
    }
}
