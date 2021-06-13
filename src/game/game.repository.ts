import {Game} from './game.entity';
import { EntityRepository, Repository } from "typeorm";
import { CreategameDTO } from './dto/create-game.dto';
import { GameStatus } from './game.status.enum';
import { GetGameFilterDto } from './dto/get-game-filter.dto';

@EntityRepository(Game)
export class GameRepository extends Repository<Game>{



    async creatGame(CreategameDTO:CreategameDTO) : Promise<Game> {
        const {user_1,user_2} = CreategameDTO;
        const game = new Game();
        game.user_1 = user_1;
        game.user_2 = user_2;
        game.status=GameStatus.OPEN;
        await game.save();
        return game;
    }
}