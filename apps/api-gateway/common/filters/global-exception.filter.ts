import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = (res as any).message || exception.message;
        } else if (
            exception &&
            typeof exception === 'object' &&
            'status' in exception &&
            'message' in exception
        ) {
            // Handle RPC Error Objects that look like { status: 409, message: '...' }
            status =
                typeof exception.status === 'number'
                    ? exception.status
                    : HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
        } else {
            this.logger.error('Unhandled Exception:', exception);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
