import {Movement} from './movement.entity';
import { EntityRepository, Repository } from "typeorm";
import { CreatemovementDTO } from './dto/create-movement.dto';
import { MoveCharacter } from './movement.status.enum';
import {winChoices} from './movement.win';

@EntityRepository(Movement)
export class MovementRepository extends Repository<Movement>{
    async createMove(CreatemovementDTO:CreatemovementDTO) : Promise<Movement> {
        const {game_id,user,character,cell} = CreatemovementDTO;
        const movement = new Movement();
        movement.game_id = game_id;
        movement.user = user;
        movement.character=character;
        movement.cell=cell;
        await movement.save();
        return movement;
    }


    async getMovements(filterDto:CreatemovementDTO) : Promise<Movement[]>{
        const {game_id,user,character,cell} = filterDto;
        const query = this.createQueryBuilder('movement');
        if(game_id){
            query.andWhere('movement.game_id = :game_id',{game_id});
            query.orderBy('id','DESC');
        }

        const movements = await query.getMany();
        return movements;
    }


    async getMovementsbyGameid(filterDto:CreatemovementDTO) : Promise<Movement[]>{
        const {game_id,user,character,cell} = filterDto;
        const query = this.createQueryBuilder('movement');
        if(game_id){
            query.andWhere('movement.game_id = :game_id',{game_id});
        }
        const movements = await query.getMany();
        return movements;
    }


    async getCellStatus(game_id:number,cell:number) : Promise<boolean>{
        const query = this.createQueryBuilder('movement');
        query.andWhere('movement.game_id = :game_id',{game_id});
        query.andWhere('movement.cell = :cell',{cell});
        const cellStatus = await query.getOne();
        if(cellStatus){ return true;} else {return false;}
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
       const movementsByGameid=await this.getMovementsbyGameid(data);
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
       let differenceCellStatus = await this.getCellStatus(game_id,difference[0]);
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