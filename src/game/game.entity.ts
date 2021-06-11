import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GameStatus } from "./game.status.enum";

@Entity()
export class Game extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    user_1:string;
    @Column()
    user_2:string;
    @Column()
    status:GameStatus
}