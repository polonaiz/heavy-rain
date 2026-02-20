import { RobotStatus } from "../entities/robot-status.entity";

export class RobotStatusDto {
    robot_ts: number; // msec since epoch @robot
    seq: number;
    battery: number;
    pos: { x: number, y: number };
    status: "RUNNING" | "STOPPED" | "ERROR";
    telemetry: { vx: number, vy: number };
}

export namespace RobotStatusDto {
    export function fromRobotStatus(robotStatus: RobotStatus): RobotStatusDto {
        const r = new RobotStatusDto()
        r.robot_ts = robotStatus.robotTs
        r.seq = robotStatus.seq
        r.battery = robotStatus.battery
        r.pos = robotStatus.pos
        r.status = robotStatus.status
        r.telemetry = robotStatus.telemetry
        return r
    }
}