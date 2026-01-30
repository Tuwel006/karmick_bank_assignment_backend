
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

async function run() {
    const client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 4002,
        },
    });

    try {
        console.log('Connecting to Users Service at localhost:4002...');
        await client.connect();
        console.log('Connected.');

        console.log('Sending find_by_email_with_password request...');
        const result = await firstValueFrom(
            client.send('users.find_by_email_with_password', { email: 'test@test.com' }) // Use an email that might exist or not
        );
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

run();
