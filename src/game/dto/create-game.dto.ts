import { IsNotEmpty, isBoolean } from 'class-validator';


export class CreategameDTO {
    @IsNotEmpty()
    user_1:string;
    @IsNotEmpty()
    user_2:string;
  
}