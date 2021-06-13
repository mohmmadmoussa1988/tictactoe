import { IsIn,IsNotEmpty, isBoolean,IsAlpha, IsNumber } from 'class-validator';
import {MoveCharacter} from '../movement.status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatemovementDTO {
    @IsNotEmpty()
    @ApiProperty({
        type:Number,
        description:'Game ID',
    })
    game_id:number;
    @IsNotEmpty()
    @IsAlpha()
    @ApiProperty({
        type:String,
        description:'Name of the player',
    })
    user:string;
    @IsNotEmpty()
    @IsIn([MoveCharacter.x,MoveCharacter.o])
    @ApiProperty({
        type:String,
        description:'X or O',
    })
    character:MoveCharacter;
    @IsNotEmpty()
    @IsNumber()
    @IsIn([1,2,3,4,5,6,7,8,9])
    @ApiProperty({
        type:Number,
        description:'the 9 cells of the game',
    })
    cell:number;
  
}