import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MICROSERVICE_GATEWAY = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url: 'redis://redis:6379',
  },
});
