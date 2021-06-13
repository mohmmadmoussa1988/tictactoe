import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isBoolean } from 'class-validator';


export class CreategameDTO {
   
    @IsNotEmpty()
    @ApiProperty({
        type:String,
        description:'The First user of the game',
    })
    user_1:string;
    
    @IsNotEmpty()
    @ApiProperty({
        type:String,
        description:'The Second user of the game - could be "Computer" if you want to play with computer',
    })
    user_2:string;
  
}