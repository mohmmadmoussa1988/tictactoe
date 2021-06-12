import { IsIn,IsNotEmpty, isBoolean,IsAlpha, IsNumber } from 'class-validator';
import {MoveCharacter} from '../movement.status.enum';

export class CreatemovementDTO {
    @IsNotEmpty()
    game_id:number;
    @IsNotEmpty()
    @IsAlpha()
    user:string;
    @IsNotEmpty()
    @IsIn([MoveCharacter.x,MoveCharacter.o])
    character:MoveCharacter;
    @IsNotEmpty()
    @IsNumber()
    @IsIn([1,2,3,4,5,6,7,8,9])
    cell:number;
  
}