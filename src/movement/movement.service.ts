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
                const checkWinning = this.areCommonElements(cells,Move);
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
    
            const Move = await this.computerTurn(CreatemovementDTO);
            console.log('createComputerMove',Move);
            const result =await this.createMove(Move);  
            return result;
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

     computerTurn = async (data) =>{
         //console.log('computer turn');
         const {game_id} = data;
        const movementsByGameid=await this.MovementRepository.getMovementsbyGameid(data);
        const cell5 = movementsByGameid.filter(cell=>cell.cell==5);
            var Move = new CreatemovementDTO() ;
            Move.game_id=game_id;
            Move.character=MoveCharacter.o;
            Move.user='Computer';
            if(movementsByGameid.length>2){
                //console.log('more than 2');
                Move.cell=await this.nextMove(movementsByGameid,data,game_id);
                console.log('Move.cell',Move.cell);
            }
            else{
                if(cell5.length==0){
                    Move.cell=5;
                }
                else{
                    Move.cell=this.randomCell();
                }
            }
            return Move;
     }

     safeMove = async(movementsByGameid) =>{
        const allFilledCells = movementsByGameid.map(move=>move.cell);
        const allCells = [1,2,3,4,5,6,7,8,9];
        let difference = allCells.filter(e => !allFilledCells.includes(e));
        return difference[0];
     }
     defeatOpponentMove = async(WinMoves:any[],chunk:number[],game_id:number):Promise<number> =>{
        let difference = WinMoves.filter(e => !chunk.includes(e));
        let differenceCellStatus = await this.MovementRepository.getCellStatus(game_id,difference[0]);
        //console.log('differenceCellStatus',differenceCellStatus);
        if(differenceCellStatus==false){
            //console.log('difference',difference);
            return difference[0];
        }
     }
     randomCell = () => {
        const availableCells = [1,2,3,4,6,7,8,9];
        const random =Math.floor(Math.random() * availableCells.length);
        let result=availableCells[random];
         return result;
     }

     nextMove = async (movementsByGameid:any[],data:any,game_id:number) : Promise<number> =>{
        const opponentPlayes = movementsByGameid.filter(Move=>Move.user==data.user);
        const cells = opponentPlayes.map(move=>move.cell);
        const computerMove = await this.computerMovefunc(cells,movementsByGameid,game_id);
        console.log('computerMove',computerMove);
        return computerMove;
     }

     nextMoveWinChoices = async (movementsByGameid,winChoices,chunk,game_id) :Promise<any> =>{
        var result;
        var thereIsAWinMove=false;
        for (const WinMoves of winChoices) {
            console.log('chunk',chunk,'WinMoves',WinMoves);
                const checkWinsMoves = chunk.every(Move => WinMoves.includes(Move));
                console.log('checkWinsMoves',checkWinsMoves);
                if (checkWinsMoves==true && thereIsAWinMove==false){
                    thereIsAWinMove=true;
                    result = await this.defeatOpponentMove(WinMoves,chunk,game_id);
                }

          }

        return result;
     }

     computerMovefunc = async (cells,movementsByGameid,game_id) =>{
        console.log('cells',cells)
        let secondMove;
        for(let i=0;i<cells.length-1;i++){
            console.log('i',i)
            if(!secondMove)
            secondMove = await this.secondMoveFunc(i,cells,game_id,movementsByGameid);
        }
        console.log('secondMove',secondMove);

        return secondMove;

    }
    secondMoveFunc = async (i,cells,game_id,movementsByGameid) =>{
        var result;
        var nextMoveWinChoicesvar
        for(let z=i+1;z<cells.length;z++){
            let chunk = [cells[i],cells[z]];
            nextMoveWinChoicesvar = await this.nextMoveWinChoices(movementsByGameid,winChoices,chunk,game_id);
        }
        console.log('secondMoveFunc nextMoveWinChoicesvar ',nextMoveWinChoicesvar);
        if(nextMoveWinChoicesvar!=undefined)
        {
            result= nextMoveWinChoicesvar;
            console.log('result 1',result);
        }
        else{
            result= this.safeMove(movementsByGameid);
            console.log('result 2',result);

        }
        console.log('result',result);
        return result;
    }

}
