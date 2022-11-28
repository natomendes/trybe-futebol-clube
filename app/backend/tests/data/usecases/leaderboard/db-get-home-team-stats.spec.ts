import { StatsModel, TeamModel } from "../../../../src/domain/models";
import { homeStatsMock, homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import { GetHomeTeamStatsRepository } from '../../../../src/data/protocols';
import DbGetHomeTeamStats from '../../../../src/data/usecases/leaderboard/db-get-home-team-stats';
import { HomeStats } from "../../../../src/domain/usecases";

const makeGetHomeTeamStatsRepositoryStub = (): GetHomeTeamStatsRepository => {
  class GetHomeTeamStatsRepositoryStub implements GetHomeTeamStatsRepository {
    async findAll(): Promise<TeamModel[]> {
      return homeTeamDbResult;
    }
  }

  return new GetHomeTeamStatsRepositoryStub();
}

const makeHomeStatsStub = (): HomeStats => {
  class HomeStatsStub implements HomeStats {
    calculate(teamsData: TeamModel[]): StatsModel[] {
      return homeStatsMock;
    }
  }
  return new HomeStatsStub();
}

interface SutTypes {
  sut: DbGetHomeTeamStats,
  getHomeTeamStatsRepositoryStub: GetHomeTeamStatsRepository
  homeStatsStub: HomeStats
}

const makeSut = (): SutTypes => {
  const homeStatsStub = makeHomeStatsStub();
  const getHomeTeamStatsRepositoryStub = makeGetHomeTeamStatsRepositoryStub();
  const sut = new DbGetHomeTeamStats(
    getHomeTeamStatsRepositoryStub,
    homeStatsStub
  );
  return {
    sut,
    getHomeTeamStatsRepositoryStub,
    homeStatsStub
  }
};

describe('DbGetHomeTeamStats', () => {
  it('Should throw if GetHomeTeamStatsRepository throws', async () => {
    const { sut, getHomeTeamStatsRepositoryStub } = makeSut();
    jest.spyOn(getHomeTeamStatsRepositoryStub, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.handle();
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if HomeStats throws', async () => {
    const { sut, homeStatsStub } = makeSut();
    jest.spyOn(homeStatsStub, 'calculate')
      .mockImplementationOnce(() => { throw new Error()});
    const promise = sut.handle();
    await expect(promise).rejects.toThrow();
  });

  it('Should call HomeStats with correct values', async () => {
    const { sut, homeStatsStub } = makeSut();
    const calculateSpy = jest.spyOn(homeStatsStub, 'calculate');
    await sut.handle();
    expect(calculateSpy).toHaveBeenCalledWith(homeTeamDbResult);
  });
});
