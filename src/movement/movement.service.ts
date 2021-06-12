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
    constructor(
        @InjectRepository(MovementRepository)
        private MovementRepository : MovementRepository,
        private GameService:GameService){
    
    }

   async createMove(CreatemovementDTO:CreatemovementDTO):Promise < any >{
    const {game_id,user,character,cell} = CreatemovementDTO;    
    const movements = await this.MovementRepository.getMovements(CreatemovementDTO);
    //console.log('get movements',movements);
        if(movements.length>0){
            if(user === movements[0].user){
                //console.log(user,movements[0].user);
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
            winChoices.forEach(Move=>{
                const checkWinning = this.areCommonElements(cells,Move);
                if(checkWinning) {won=true;}
            })
            
            if(won){
                this.GameService.updateGameStatus(game_id,GameStatus.DONE);
                return {message:`${user} won!!!`};
            }
            else{
                if(movementsByGameid.length==9){
                    this.GameService.updateGameStatus(game_id,GameStatus.DONE);
                    return {message:'Game Over'};

                }
            }
            
        }
        const Game = await this.GameService.getGameById(game_id);
        if(Game.user_2=="Computer" && user!='Computer' ){
            //console.log('user',user,'movement',movements,CreatemovementDTO);
            await this.computerTurn(game_id,CreatemovementDTO);
        }

        return {message:'next Move'};
        
     } 

     areCommonElements = (arr1, arr2) => {
         let counter=0;
         arr1.forEach(arr=>{
             if(arr2.includes(arr)){
                 counter++;
             }
         })
       if(counter>2){
           return true;
       }
       else{
           return false;
       }
    };

     computerTurn = async (game_id,data) =>{
        const movementsByGameid=await this.MovementRepository.getMovementsbyGameid(data);
        const cell5 = movementsByGameid.filter(cell=>cell.cell==5);
        //console.log('computer turn');

            var Move5 = new CreatemovementDTO() ;
            Move5.game_id=game_id;
            Move5.character=MoveCharacter.o;
            Move5.user='Computer';

            if(movementsByGameid.length>2){
                //console.log('do nothing',movementsByGameid);
                const oponentPlayes = movementsByGameid.filter(Move=>Move.user==data.user);
                const cells = oponentPlayes.map(move=>move.cell);
                console.log('cells',cells);
                for(let i=0;i<cells.length;i++){
                        for(let z=i+1;z<cells.length;z++){
                            let chunk = [cells[i],cells[z]];
                            let isThereWinMoves=false;
                            winChoices.forEach(async WinMoves=>{
                                console.log('winMoves',WinMoves);
                                if ((chunk.every(Move => WinMoves.includes(Move)))==true){
                                    isThereWinMoves=true;
                                    let difference = WinMoves.filter(e => !chunk.includes(e));
                                    let differenceCellStatus = await this.MovementRepository.getCellStatus(game_id,difference[0]);
                                    console.log('true WinMoves',WinMoves,differenceCellStatus);
                                    if(differenceCellStatus==false){
                                        Move5.cell=difference[0];
                                    }
                                }
                            })

                            if(isThereWinMoves==false){
                                const allFilledCells = movementsByGameid.map(move=>move.cell);
                                const allCells = [1,2,3,4,5,6,7,8,9];
                                let difference = allCells.filter(e => !allFilledCells.includes(e));
                                Move5.cell=difference[0];

                            }



                            console.log('chunk',chunk);
                        }
                    
                }


                /* 
 */




            }
            else{
                //console.log('Less than 2 plays');
                //console.log('cell 5',cell5.length);
                if(cell5.length==0){
                    Move5.cell=5;
                }
                else{
                    const availableCells = [1,2,3,4,6,7,8,9];
                    const random =Math.floor(Math.random() * availableCells.length);
                    Move5.cell = availableCells[random];
                }
            }
            await this.createMove(Move5);  
     }

     checkCell = async (cell) =>{

    }
}


