import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { GameStatus } from "../game.status.enum";

export class GetGameFilterDto {
    @IsOptional()
    @IsIn([GameStatus.OPEN,GameStatus.DONE])
    status:GameStatus;
    @IsOptional()
    @IsNotEmpty()
    search:string;
}