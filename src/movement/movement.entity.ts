import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {MoveCharacter} from './movement.status.enum';
@Entity()
export class Movement extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    game_id:number;
    @Column()
    user:string;
    @Column()
    character:string
    @Column()
    cell:number
}