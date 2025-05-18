import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FileModule } from './file/file.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerUserGuard } from './common/guards/throttler-user.guard';
import { BullModule } from '@nestjs/bullmq';
import { FileProcessingModule } from './file-processing/file-processing.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    HealthModule,
    FileModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 50,
      },
    ]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    FileProcessingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerUserGuard,
    },
  ],
})
export class AppModule {}
