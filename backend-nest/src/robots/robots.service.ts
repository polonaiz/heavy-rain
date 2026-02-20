import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './entities/robot.entity';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { RobotStatusDto } from './dto/robot-status.dto';
import { RobotStatus } from './entities/robot-status.entity';

@Injectable()
export class RobotsService {
  constructor(
    @InjectRepository(Robot, 'postgresConnection') private readonly robotRepository: Repository<Robot>,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(RobotStatus, 'mongodbConnection') private readonly robotStatusRepository: Repository<RobotStatus>
  ) { }

  async create(createRobotDto: CreateRobotDto): Promise<Robot> {
    return await this.robotRepository.save(createRobotDto);
  }

  async findAll(): Promise<Robot[]> {
    return await this.robotRepository.find();
  }

  async findOne(id: string) {
    return await this.robotRepository.findOneBy({ id });
  }

  async update(id: string, updateRobotDto: UpdateRobotDto) {
    return await this.robotRepository.update({ id }, updateRobotDto)
  }

  async remove(id: string) {
    return await this.robotRepository.delete({ id });
  }

  async createStatus(
    id: string,
    robotStatusDto: RobotStatusDto
  ): Promise<RobotStatusDto | null> {
    // remove 1 hour old data. 
    const timestampNow = Date.now()
    const timestampOneHourAgo = timestampNow - 60 * 60 * 1000
    await this.redis.zremrangebyscore(`robots/${id}/statuses`, 0, timestampOneHourAgo)

    // add new status
    const result = await this.redis.zadd(
      `robots/${id}/statuses`,
      robotStatusDto.robot_ts,
      JSON.stringify(robotStatusDto))
    if (!result) {
      return null
    }

    // save to mongodb for backup
    const robotStatus = new RobotStatus()
    robotStatus.robotId = id
    robotStatus.robotTs = robotStatusDto.robot_ts
    robotStatus.seq = robotStatusDto.seq
    robotStatus.pos = robotStatusDto.pos
    robotStatus.status = robotStatusDto.status
    await this.robotStatusRepository.save(robotStatus)

    return robotStatusDto
  }

  async getStatus(
    id: string
  ): Promise<RobotStatusDto | null> {
    const statusRaws = await this.redis.zrevrange(`robots/${id}/statuses`, 0, 0)
    if (!statusRaws.length) {
      return null
    }
    return JSON.parse(statusRaws[0]) as RobotStatusDto
  }

  async getStatusHistory(
    id: string, tsBeg?: number, tsEnd?: number
  ): Promise<RobotStatus[]> {
    const where: any = {
      robotId: id,
      robotTs: {
        $gte: tsBeg ?? 0,
        $lt: tsEnd ?? Date.now(),
      }
    }
    const robotStatuses = await this.robotStatusRepository.find({ where })
    return robotStatuses
  }
}
