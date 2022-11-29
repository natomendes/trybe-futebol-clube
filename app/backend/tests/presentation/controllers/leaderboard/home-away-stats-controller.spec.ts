import { StatsModel } from "../../../../src/domain/models";
import { homeStatsMock } from '../../../mocks/leaderboard-model-mock';
import { GetTeamsStats } from '../../../../src/domain/usecases';
import HomeAwayStatsController from '../../../../src/presentation/controllers/leaderboard/home-away-stats-controller';

const makeGetTeamsStatsSutb = (): GetTeamsStats => {
  class GetTeamsStatsStub implements GetTeamsStats {
    async handle(_path: string): Promise<StatsModel[]> {
      return homeStatsMock;
    }
  }

  return new GetTeamsStatsStub();
}

interface SutTypes {
  sut: HomeAwayStatsController
  getTeamsStatsStub: GetTeamsStats
}

const makeSut = (): SutTypes => {
  const getTeamsStatsStub = makeGetTeamsStatsSutb();
  const sut = new HomeAwayStatsController(getTeamsStatsStub);
  return {
    sut,
    getTeamsStatsStub
  }
}

describe('HomeAwayStatsController', () => {
  it('Should return server error if GetTeamsStats throws', async () => {
    const { sut, getTeamsStatsStub } = makeSut();
    jest.spyOn(getTeamsStatsStub, 'handle')
      .mockRejectedValueOnce(new Error());
    const httpRequest = {
      body: {
        path: 'home'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'});
  });

  it('Should return homeTeam stats order by total points on success', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        path: 'home'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(homeStatsMock);
  });
});
