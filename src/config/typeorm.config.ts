import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions= {
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password : '',
    database : 'tictactoe',
    entities: [__dirname+'/../**/*.entity{.ts,.js}'],
    synchronize:true
}