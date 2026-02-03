import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseFilters } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { GlobalExceptionFilter } from '@/shared/filters/global-exception.filter';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('User Management')
@Controller('users')
@UseFilters(GlobalExceptionFilter)
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+91-98765-43210',
          branchId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        statusCode: 201,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: CreateUserDto) {
    return this.client.send(
      MESSAGE_PATTERNS.users.CREATE,
      data,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'john@example.com' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'firstName' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          items: [{
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+91-98765-43210',
            branchId: '550e8400-e29b-41d4-a716-446655440001',
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
    return this.client.send(MESSAGE_PATTERNS.users.FIND_ALL, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'User retrieved successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+91-98765-43210',
          branchId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        statusCode: 200,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.users.FIND_ONE, { id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: {
      example: {
        success: true,
        message: 'User updated successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'jane.doe@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+91-87654-32109',
          branchId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z'
        },
        statusCode: 200,
        timestamp: '2024-01-01T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.client.send(MESSAGE_PATTERNS.users.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'User deleted successfully',
        data: null,
        statusCode: 200,
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.users.DELETE, { id });
  }
}
