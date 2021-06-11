import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GameModule
    ],
})
export class AppModule {}
