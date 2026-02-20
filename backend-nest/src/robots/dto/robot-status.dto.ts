export class RobotStatusDto {
    robot_ts: number; // msec since epoch @robot
    seq: number;
    battery: number;
    pos: { x: number, y: number };
    status: "RUNNING" | "STOPPED" | "ERROR";
    telemetry: { vx: number, vy: number };
}
