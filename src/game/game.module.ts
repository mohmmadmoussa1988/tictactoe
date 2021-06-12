import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([GameRepository])
  ],
  controllers: [GameController],
  providers: [GameService],
  exports:[GameService]
})
export class GameModule {}
