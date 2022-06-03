import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const BOT_ROUTER = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url: 'redis://redis:6379',
  },
});
