import { Injectable, NotFoundException } from '@nestjs/common';
import {GameStatus} from './game.status.enum';
import { CreategameDTO } from './dto/create-game.dto';
import { GetGameFilterDto } from './dto/get-game-filter.dto';
import { GameRepository } from './game.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameRepository)
        private GameRepository : GameRepository){
    
    }

    async getGameById(id:number):Promise<Game>{
        const found= await this.GameRepository.findOne(id);
        if(!found){
            throw new NotFoundException(`Task with Id "${id}" was not found!`);
        }
        return found;
    }

     async createGame(createTaskDto:CreategameDTO):Promise<Game>{
       return await this.GameRepository.creatGame(createTaskDto);

    } 

    async updateGameStatus(id:number,status:GameStatus) : Promise<Game>{
         const game = await this.getGameById(id);
         game.status = status;
         await game.save();
         return game; 
     } 



}
