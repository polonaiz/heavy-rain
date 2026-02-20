import { 
  Controller, Get, Post, Patch, Delete, 
  Param, Query, Body, 
  ParseIntPipe,
  NotFoundException, ConflictException, 
} from '@nestjs/common';
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
    const robotStatusDtoSaved = await this.robotsService.createStatus(id, robotStatusDto)
    if (!robotStatusDtoSaved) {
      throw new ConflictException(`FAILURE: cannot create RobotStatus: id='${id}', ts='${robotStatusDto.robot_ts}'`)
    }
    return robotStatusDtoSaved
  }

  @Get(':id/status')
  async getStatus(
    @Param('id') id: string,
  ) {
    const robotStatus = await this.robotsService.getStatus(id)
    if (!robotStatus) {
      throw new NotFoundException(`FAILURE: cannot find RobotStatus: id='${id}'`)
    }
    return robotStatus
  }

  @Get(':id/status-history')
  async getStatusHistory(
    @Param('id') id: string,
    @Query('ts_beg', new ParseIntPipe({ optional: true })) tsBeg?: number,
    @Query('ts_end', new ParseIntPipe({ optional: true })) tsEnd?: number,
  ): Promise<RobotStatusDto[]> {
    const robotStatuses = await this.robotsService.getStatusHistory(id, tsBeg, tsEnd)
    return robotStatuses.map(RobotStatusDto.fromRobotStatus)
  }
}
