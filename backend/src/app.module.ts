import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrganizationModule } from './organizations/organization.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrganizationModule,
    MongooseModule.forRoot('mongodb://localhost/ideanset'),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JWTAuthGuard }],
})
export class AppModule {}
