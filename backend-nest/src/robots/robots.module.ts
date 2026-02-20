import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';
import { Robot } from './entities/robot.entity';
import { RobotStatus } from './entities/robot-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Robot
    ], 'postgresConnection'),
    TypeOrmModule.forFeature([
      RobotStatus
    ], 'mongodbConnection'),
  ],
  controllers: [RobotsController],
  providers: [RobotsService],
})
export class RobotsModule { }
