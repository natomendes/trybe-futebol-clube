import { StatsModel } from "../../../../src/domain/models";
import { homeStatsMock } from '../../../mocks/leaderboard-model-mock';
import { GetHomeTeamStats } from '../../../../src/domain/usecases';
import HomeTeamStatsController from '../../../../src/presentation/controllers/leaderboard/home-team-stats-controller';

const makeGetHomeTeamStatsSutb = (): GetHomeTeamStats => {
  class GetHomeTeamStatsStub implements GetHomeTeamStats {
    async handle(): Promise<StatsModel[]> {
      return homeStatsMock;
    }
  }

  return new GetHomeTeamStatsStub();
}

interface SutTypes {
  sut: HomeTeamStatsController
  getHomeTeamStatsStub: GetHomeTeamStats
}

const makeSut = (): SutTypes => {
  const getHomeTeamStatsStub = makeGetHomeTeamStatsSutb();
  const sut = new HomeTeamStatsController(getHomeTeamStatsStub);
  return {
    sut,
    getHomeTeamStatsStub
  }
}

describe('HomeTeamStatsController', () => {
  it('Should return server error if GetHomeTeamStats throws', async () => {
    const { sut, getHomeTeamStatsStub } = makeSut();
    jest.spyOn(getHomeTeamStatsStub, 'handle')
      .mockRejectedValueOnce(new Error());
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'});
  })
});
