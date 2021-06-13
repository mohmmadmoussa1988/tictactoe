import { Dependencies, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {MovementRepository} from './movement.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {CreatemovementDTO} from './dto/create-movement.dto';
import {Movement} from './movement.entity';
import {winChoices} from './movement.win';
import {GameService} from '../game/game.service';
import {GameStatus} from '../game/game.status.enum';
import {MoveCharacter} from './movement.status.enum';
@Injectable()
export class MovementService {
    public nextMoveCell:number;
    constructor(
        @InjectRepository(MovementRepository)
        private MovementRepository : MovementRepository,
        private GameService:GameService){
            
    }

   async createMove(CreatemovementDTO:CreatemovementDTO):Promise < any >{
    const {game_id,user,character,cell} = CreatemovementDTO;   

    const movements = await this.MovementRepository.getMovements(CreatemovementDTO);
    ////console.log('get movements',movements);
        if(movements.length>0){
            if(user === movements[0].user){
                ////console.log(user,movements[0].user);
                throw new NotFoundException (`Not your turn!`);
            }

            if(character==movements[0].character){
                throw new NotFoundException (`Wrong character`);
            }

            const cellAlreadyUsed = (movements).filter(movement => cell==movement.cell);

            if(cellAlreadyUsed.length>0){
                throw new NotFoundException (`Cell not empty`);
            }
        }
        const moveInserted = await this.MovementRepository.createMove(CreatemovementDTO);
        const movementsByGameid=await this.MovementRepository.getMovementsbyGameid(CreatemovementDTO);
        const movementsByGameidUser = movementsByGameid.filter(Move=>Move.user==user);
        const cells = movementsByGameidUser.map(move=>move.cell);
        let won = false;
        if(cells.length>2){
            //console.log('enteting winChoices');
            for(const Move of winChoices){    
                const checkWinning = this.MovementRepository.areCommonElements(cells,Move);
                //console.log('checkWinning',checkWinning,cells,Move);
                if(checkWinning) {won=true;}
            }
            console.log('won',won,user);
            if(won){
                await this.GameService.updateGameStatus(game_id,GameStatus.DONE);
                return {message:`${user} won!!!`};
            }
            else if(movementsByGameid.length==9){
                await this.GameService.updateGameStatus(game_id,GameStatus.DONE);
                return {message:'Game Over'};
            }        
        }

        return {message:'next Move'};

       

     } 

     createComputerMove = async (CreatemovementDTO:CreatemovementDTO) =>{
    
            const Move = await this.MovementRepository.computerTurn(CreatemovementDTO);
            console.log('createComputerMove',Move);
            const result =await this.createMove(Move);  
            return result;
        }



}
