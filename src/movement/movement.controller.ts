import { Body, Controller, Get,Post,Param, Delete,Patch,Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import {MovementService} from './movement.service';
import {CreatemovementDTO} from './dto/create-movement.dto';
import {Movement} from './movement.entity';
import {MovementRepository} from './movement.repository';
import {MoveStatusValidationPipe} from './pipes/move-status-validation.pipe';
import {GameService} from '../game/game.service';
import {GameStatus} from '../game/game.status.enum';
import { ApiTags,ApiCreatedResponse,ApiBody,ApiForbiddenResponse } from '@nestjs/swagger';


@ApiTags('Movements')
@Controller('movement')
export class MovementController {
    constructor(private MovementService : MovementService,private GameService:GameService) {  

    }

    @Post()
    @UsePipes(ValidationPipe)
    @ApiCreatedResponse({description:'Submit a new Move'})
    @ApiBody({type:CreatemovementDTO})
    @ApiForbiddenResponse({description : 'Forbidden'})
    async createMove(@Body() CreatemovementDTO:CreatemovementDTO) : Promise < any > {
      const {game_id,user,character,cell} = CreatemovementDTO;   
      const userMove = await this.MovementService.createMove(CreatemovementDTO);
      const Game = await this.GameService.getGameById(game_id);
      if(Game.status==GameStatus.OPEN){
      if(Game.user_2=="Computer" && user!='Computer'){
        return await this.MovementService.createComputerMove(CreatemovementDTO);
      }
      else{
        return userMove;
      }
    }
    else{
      return userMove;
    }

    }


}
