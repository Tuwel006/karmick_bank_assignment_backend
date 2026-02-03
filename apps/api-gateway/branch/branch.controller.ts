import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseFilters } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { GlobalExceptionFilter } from '@/shared/filters/global-exception.filter';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { CreateBranchDto, UpdateBranchDto, CreateAddressDto } from './dto/branch.dto';

@ApiTags('Branch Management')
@Controller('branch')
@UseFilters(GlobalExceptionFilter)
export class BranchController {
  constructor(
    @Inject('BRANCH_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Branch created successfully',
    schema: {
      example: {
        success: true,
        message: 'Branch created successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Mumbai Main Branch',
          ifsc: 'KB123456789',
          phoneNumber: '+91-22-12345678',
          address: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        statusCode: 201,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: CreateBranchDto) {
    return this.client.send(
      MESSAGE_PATTERNS.BRANCH.CREATE,
      data,
    );
  }

  @Post(':id/address')
  @ApiOperation({ summary: 'Add address to branch' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Address added successfully',
    schema: {
      example: {
        success: true,
        message: 'Address added to branch successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          street: '123 MG Road',
          landmark: 'Near Fort Station',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          type: 'office',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        statusCode: 201,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  addAddress(@Param('id') branchId: string, @Body() data: CreateAddressDto) {
    return this.client.send('branch.add_address', {
      branchId,
      ...data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all branches with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Mumbai' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC' })
  @ApiResponse({ 
    status: 200, 
    description: 'Branches retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Branches retrieved successfully',
        data: {
          items: [{
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Mumbai Main Branch',
            ifsc: 'KB123456789',
            phoneNumber: '+91-22-12345678',
            address: {
              id: '550e8400-e29b-41d4-a716-446655440001',
              street: '123 MG Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              country: 'India',
              type: 'office'
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        },
        statusCode: 200,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  findAll(@Query() query: PaginationDto) {
    return this.client.send(MESSAGE_PATTERNS.BRANCH.FIND_ALL, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Branch retrieved successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Mumbai Main Branch',
          ifsc: 'KB123456789',
          phoneNumber: '+91-22-12345678',
          address: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            street: '123 MG Road',
            landmark: 'Near Fort Station',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            type: 'office'
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        statusCode: 200,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.BRANCH.FIND_ONE, { id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateBranchDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Branch updated successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Mumbai Central Branch',
          ifsc: 'KB123456789',
          phoneNumber: '+91-22-87654321',
          address: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra'
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z'
        },
        statusCode: 200,
        timestamp: '2024-01-01T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  update(
    @Param('id') id: string,
    @Body() data: UpdateBranchDto,
  ) {
    return this.client.send(MESSAGE_PATTERNS.BRANCH.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Branch deleted successfully',
        data: null,
        statusCode: 200,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.BRANCH.DELETE, { id });
  }
}