import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RobotsModule } from './robots/robots.module';
import { RedisModule } from '@songkeys/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    //
    TypeOrmModule.forRootAsync({
      name: 'postgresConnection',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,
        synchronize: true, // 개발 환경에서만 사용, 운영 환경에서는 false로 설정
        logging: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD')
        }
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongodbConnection',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        // url: `mongodb://${configService.get<string>('MONGO_HOST')}:${configService.get<number>('MONGO_PORT')}/${configService.get<string>('MONGO_DATABASE')}?authSource=admin`,
        host: configService.get<string>('MONGO_HOST'),
        port: configService.get<number>('MONGO_PORT'),
        username: configService.get<string>('MONGO_USERNAME'),
        password: configService.get<string>('MONGO_PASSWORD'),
        database: configService.get<string>('MONGO_DATABASE'),
        authSource: 'admin',

        autoLoadEntities: true,
        synchronize: true, // 개발 환경에서만 사용, 운영 환경에서는 false로 설정
        logging: true,
      }),
    }),

    RobotsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
