import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { PRODUCTION } from './const/env';

export const BOT_ROUTER = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url: PRODUCTION ? 'redis://redis:6379' : 'redis://localhost:6379',
  },
});
