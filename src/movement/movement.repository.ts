import {Movement} from './movement.entity';
import { EntityRepository, Repository } from "typeorm";
import { CreatemovementDTO } from './dto/create-movement.dto';
import { MoveCharacter } from './movement.status.enum';

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



}