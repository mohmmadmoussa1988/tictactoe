import {PipeTransform, BadRequestException} from '@nestjs/common';
import { MoveCharacter } from '../movement.status.enum';

export class MoveStatusValidationPipe implements PipeTransform {
readonly allowedStatuses = [
    MoveCharacter.x,MoveCharacter.o
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