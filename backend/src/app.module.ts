import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrganizationModule } from './organizations/organization.module';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
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
    MongooseModule.forRoot('mongodb://localhost/ideanset'),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JWTAuthGuard }],
})
export class AppModule {}
