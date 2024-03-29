import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MICROSERVICE_GATEWAY = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url:
      process.env.mode === 'production'
        ? 'redis://redis:6379'
        : 'redis://localhost:6379',
  },
});
