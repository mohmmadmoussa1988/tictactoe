import {GameService} from './game.service';
import {GameRepository} from './game.repository';
import {Test} from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {GameStatus} from './game.status.enum';

const mockGameRepository=()=>({
    getGameById : jest.fn(),
    findOne : jest.fn(),
    creatGame:jest.fn()
});

describe('GameService', () => {
   let gameService;
   let gameRepository;
  
   beforeEach(async()=>{
       const module = await Test.createTestingModule({
           providers:[
            GameService,
                {provide:GameRepository,useFactory:mockGameRepository}
           ]
       }).compile();
       gameService = await module.get<GameService>(GameService);
       gameRepository = await module.get<GameRepository>(GameRepository);
   })
    describe('getGameById', () => {
      it('get game info by id', async () => {
        const mockGame = {user_1 : 'Tim',user_2:'Anthony',status:'OPEN'};
        gameRepository.findOne.mockResolvedValue(mockGame);
        const result = await gameService.getGameById(1);
        expect(result).toEqual(mockGame);
        expect(gameRepository.findOne).toHaveBeenCalledWith(1)
    });

    it('get game info by id throws an error!', async () => {
        gameRepository.findOne.mockResolvedValue(null);
        expect(gameService.getGameById(1)).rejects.toThrow(NotFoundException);
    });

});

     describe('createGame', () => {
        it('calls gameRepository.creatGame and return the result', async () => {
            const mockCreateDto = {user_1:'Tim',user_2:'Anthony'};
            gameRepository.creatGame.mockResolvedValue(mockCreateDto);
             const result = await gameService.createGame(mockCreateDto);
             console.log('result',result);
             expect(Object.keys(result).length).toEqual(2);
            expect(gameRepository.creatGame).toHaveBeenCalledWith(mockCreateDto)

         
      });
    }); 


    describe('updateGameStatus', () => {
        it('calls GameService.updateGameStatus and return the status updated', async () => {
            const save = jest.fn().mockReturnValue(true);
            gameService.getGameById = jest.fn().mockResolvedValue({
                id:1,
                status:GameStatus.DONE,
                save
            })
            expect(gameService.getGameById).not.toHaveBeenCalled();
            const result = await gameService.updateGameStatus(1,GameStatus.DONE);
            expect(gameService.getGameById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(GameStatus.DONE);

           

         
      });
    }); 
 
});