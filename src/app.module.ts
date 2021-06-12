import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
import {MovementModule} from './movement//movement.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GameModule,
    MovementModule
    ]
})
export class AppModule {}
