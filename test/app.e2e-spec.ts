import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication,HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {CreategameDTO} from '../src/game/dto/create-game.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async ()=>{
    await app.close();
  })

  it('/game (POST)', async () => {
    const game ={
      user_1:'Tim',
      user_2:'Anthony'
    } 
    return request(app.getHttpServer())
    .post("/game")
    .set("Accept", "application/json")
    .send(game)
    .expect(HttpStatus.CREATED);
  });



  it('/game (GET)', async () => {
    return request(app.getHttpServer())
      .get('/game/1')
      .expect(200)
      .expect({
        "id": 1,
        "user_1": "Tim",
        "user_2": "Anthony",
        "status": "OPEN"
    });
  });




   it('/game/:id/status (PATCH)', async () => {
    const status ={
      "status":"DONE"
    }
    return request(app.getHttpServer())
    .patch("/game/1/status")
    .set("Accept", "application/json")
    .send(status)
    .expect(200)
    .expect({
      "id": 1,
      "user_1": "Tim",
      "user_2": "Anthony",
      "status": "DONE"
  });
  });
 



});
