import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export const getRedisClient = async (configService: ConfigService) => {
  const client = createClient({
    url: configService.get('REDIS_URL', 'redis://localhost:6379'),
  });

  client.on('error', (err) => console.error('Redis Client Error', err));
  await client.connect();

  return client;
};
