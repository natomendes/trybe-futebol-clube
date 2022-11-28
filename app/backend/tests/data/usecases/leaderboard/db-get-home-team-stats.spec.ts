import { TeamModel } from "../../../../src/domain/models";
import { homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import { GetHomeTeamStatsRepository } from '../../../../src/data/protocols';
import DbGetHomeTeamStats from '../../../../src/data/usecases/leaderboard/db-get-home-team-stats';

const makeGetHomeTeamStatsRepositoryStub = (): GetHomeTeamStatsRepository => {
  class GetHomeTeamStatsRepositoryStub implements GetHomeTeamStatsRepository {
    async findAll(): Promise<TeamModel[]> {
      return homeTeamDbResult;
    }
  }

  return new GetHomeTeamStatsRepositoryStub();
}

interface SutTypes {
  sut: DbGetHomeTeamStats,
  getHomeTeamStatsRepositoryStub: GetHomeTeamStatsRepository
}

const makeSut = (): SutTypes => {
  const getHomeTeamStatsRepositoryStub = makeGetHomeTeamStatsRepositoryStub();
  const sut = new DbGetHomeTeamStats(getHomeTeamStatsRepositoryStub);
  return {
    sut,
    getHomeTeamStatsRepositoryStub
  }
};

describe('DbGetHomeTeamStats', () => {
  it('Should throw if GetHomeTeamStatsRepository throws', async () => {
    const { sut, getHomeTeamStatsRepositoryStub } = makeSut();
    jest.spyOn(getHomeTeamStatsRepositoryStub, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.handle();
    await expect(promise).rejects.toThrow();
  })
});
