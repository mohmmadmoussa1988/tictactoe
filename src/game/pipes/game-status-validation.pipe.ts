import {PipeTransform, BadRequestException} from '@nestjs/common';
import { GameStatus } from '../game.status.enum';

export class GameStatusValidationPipe implements PipeTransform {
readonly allowedStatuses = [
    GameStatus.OPEN,GameStatus.DONE
]
transform (value:any){
    value = value.toUpperCase();
    if(!this.isStatusValid(value)){
        throw new BadRequestException(`value ${value} is an invalid status`);
    }
    return value;
}

private isStatusValid(status:any){

    const idx = this.allowedStatuses.indexOf(status);
    return idx !==-1;
}

}