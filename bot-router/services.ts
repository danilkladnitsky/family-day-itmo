import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { PRODUCTION } from 'src/const/env';

export const MICROSERVICE_GATEWAY = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url: PRODUCTION ? 'redis://redis:6379' : 'redis://localhost:6379',
  },
});
