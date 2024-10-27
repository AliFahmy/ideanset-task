import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrganizationModule } from './organizations/organization.module';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { DATABASE_URI, REDIS_HOST, REDIS_PORT } from './constants/constants';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: REDIS_HOST,
            port: REDIS_PORT,
          },
        });
        return {
          store: () => store,
        };
      },
    } as CacheModuleAsyncOptions),
    AuthModule,
    UsersModule,
    OrganizationModule,
    MongooseModule.forRoot(DATABASE_URI),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JWTAuthGuard }],
})
export class AppModule {}
