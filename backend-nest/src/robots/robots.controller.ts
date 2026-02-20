import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, NotFoundException, ConflictException } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { RobotResponseDto } from './dto/robot-response.dto';
import { RobotStatusDto } from './dto/robot-status.dto';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) { }

  @Post()
  async create(
    @Body() createRobotDto: CreateRobotDto
  ) {
    try {
      const robot = await this.robotsService.create(createRobotDto);
      return RobotResponseDto.fromRobot(robot)
    } catch (e) {
      if (e.code === '23505') {
        // duplicate key value violates unique constraint "IX_ROBOT_ID"
        throw new ConflictException(`FAILURE: Robot with id='${createRobotDto.id}' already exists.`)
      }
      throw e
    }
  }

  @Get()
  async findAll(): Promise<RobotResponseDto[]> {
    const robots = await this.robotsService.findAll()
    return robots.map<RobotResponseDto>(robot => RobotResponseDto.fromRobot(robot))
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<RobotResponseDto | null> {
    const robot = await this.robotsService.findOne(id)
    if (!robot) {
      throw new NotFoundException(`FAILURE: cannot find Robot: id='${id}'`)
    }
    return RobotResponseDto.fromRobot(robot)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRobotDto: UpdateRobotDto
  ) {
    const result = await this.robotsService.update(id, updateRobotDto)
    if (!result.affected) {
      throw new NotFoundException(`FAILURE: cannot find Robot: id='${id}'`)
    }
    const robot = await this.robotsService.findOne(id)
    if (!robot) {
      throw new NotFoundException(`FAILURE: cannot find Robot: id='${id}'`)
    }

    return RobotResponseDto.fromRobot(robot)
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
  ): Promise<RobotResponseDto> {
    const robot = await this.robotsService.findOne(id)
    if (!robot) {
      throw new NotFoundException(`FAILURE: cannot find Robot: id='${id}'`)
    }

    const result = await this.robotsService.remove(id)
    if (!result.affected) {
      throw new NotFoundException(`FAILURE: cannot find Robot: id='${id}'`)
    }
    return RobotResponseDto.fromRobot(robot)
  }

  @Post(':id/status')
  async createStatus(
    @Param('id') id: string,
    @Body() robotStatusDto: RobotStatusDto,
  ) {
    return await this.robotsService.createStatus(id, robotStatusDto)
  }

  @Get(':id/status')
  async getStatusRecent(
    @Param('id') id: string,
  ) {
    const robotStatus = await this.robotsService.getStatusRecent(id)
    if (!robotStatus) {
      throw new NotFoundException(`FAILURE: cannot find RobotStatus: id='${id}'`)
    }
    return robotStatus
  }
}
