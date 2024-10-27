import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Connection } from 'mongoose';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @Public()
  @Get()
  async healthCheck() {
    const dbStatus = await this.mongoConnection.db.admin().ping();
    if (!dbStatus.ok) {
      throw new InternalServerErrorException('Database is not healthy');
    }

    await this.cacheManager.set('healthcheck', 'ok', 10);
    const cacheValue = await this.cacheManager.get('healthcheck');
    if (cacheValue !== 'ok') {
      throw new InternalServerErrorException('redis is not healthy');
    }

    return {
      status: 'ok',
      database: dbStatus.ok ? 'healthy' : 'unhealthy',
      redis: cacheValue ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
    };
  }
}
