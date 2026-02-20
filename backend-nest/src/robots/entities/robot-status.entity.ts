import { Column, CreateDateColumn, Entity, In, Index, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('robotStatus')
@Index(['robotId', 'robotTs'])
export class RobotStatus {
    @ObjectIdColumn() // 관계형 DB에서는 사용 불가한 MongoDB 전용 데코레이터
    _id: ObjectId;

    @Column()
    robotId: string

    @Column()
    robotTs: number

    @Column()
    seq: number

    @Column()
    battery: number;

    @Column()
    pos: { x: number, y: number }

    @Column()
    status: "RUNNING" | "STOPPED" | "ERROR";

    @Column()
    telemetry: { vx: number, vy: number }

    @CreateDateColumn()
    @Index({ expireAfterSeconds: 24 * 3600 * 90 }) // TTL 인덱스 설정 (90일 후 자동 삭제)
    createdAt: Date
}
