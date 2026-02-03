export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  statusCode: number;
  timestamp: string;
}

export class ResponseHelper {
  static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode = 500, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success'
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    return {
      success: true,
      message,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}