import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementRepository } from './movement.repository';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';
import {GameModule} from '../game/game.module';
@Module({
  imports : [
    TypeOrmModule.forFeature([MovementRepository]),
    GameModule
    
  ],
  controllers: [MovementController],
  providers: [MovementService]
})
export class MovementModule {}
