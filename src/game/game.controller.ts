import { Body, Controller, Get,Post,Param, Delete,Patch,Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import {GameService} from './game.service';
import {GameStatus} from './game.status.enum';
import { CreategameDTO } from './dto/create-game.dto';
import { GetGameFilterDto } from './dto/get-game-filter.dto';
import { GameStatusValidationPipe } from './pipes/game-status-validation.pipe';
import { Game } from './game.entity';

@Controller('game')
export class GameController {
    constructor(private GameService : GameService) {  
    }

    @Get('/:id')
    getGameById(@Param('id',ParseIntPipe) id:number) : Promise<Game>{
      return this.GameService.getGameById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGame(@Body() CreategameDTO:CreategameDTO) : Promise<Game> {
      return  this.GameService.createGame(CreategameDTO);
    }


    @Patch('/:id/status')
    updateGameStatus(@Param('id',ParseIntPipe) id:number,
    @Body('status', 
    GameStatusValidationPipe) status:GameStatus): Promise<Game>{
      
      return  this.GameService.updateGameStatus(id,status);
    }

}
