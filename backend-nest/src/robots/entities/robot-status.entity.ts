import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('robotStatus')
@Index(['robotId', 'robotTs'])
export class RobotStatus {
    @ObjectIdColumn() // 관계형 DB에서는 사용 불가한 MongoDB 전용 데코레이터
    _id: ObjectId;

    @Column()
    robotId: string

    @Column({ type: 'int' })
    robotTs: number

    @Column()
    pos: { x: number, y: number }

    @Column()
    status: string

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: Date
}
