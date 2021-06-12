import { Body, Controller, Get,Post,Param, Delete,Patch,Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import {MovementService} from './movement.service';
import {CreatemovementDTO} from './dto/create-movement.dto';
import {Movement} from './movement.entity';
import {MovementRepository} from './movement.repository';
import {MoveStatusValidationPipe} from './pipes/move-status-validation.pipe';
@Controller('movement')
export class MovementController {
    constructor(private MovementService : MovementService) {  

    }

    @Post()
    @UsePipes(ValidationPipe)
    createMove(@Body() CreatemovementDTO:CreatemovementDTO) : Promise < any > {
      return  this.MovementService.createMove(CreatemovementDTO);
    }


}
