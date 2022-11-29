import { StatsModel, TeamModel } from "../../../../src/domain/models";
import { homeStatsMock, homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import { GetHomeMatchesRepository } from '../../../../src/data/protocols';
import DbGetHomeTeamStats from '../../../../src/data/usecases/teams/db-get-home-team-stats';
import { HomeStats } from "../../../../src/domain/usecases";
import Team from "../../../../src/database/models/Team";

const makeGetHomeMatchesRepositoryStub = (): GetHomeMatchesRepository => {
  class GetHomeMatchesRepositoryStub implements GetHomeMatchesRepository {
    async findHomeMatches(): Promise<Team[]> {
      return homeTeamDbResult as any;
    }
  }

  return new GetHomeMatchesRepositoryStub();
}

const makeHomeStatsStub = (): HomeStats => {
  class HomeStatsStub implements HomeStats {
    calculateHome(teamsData: TeamModel[]): StatsModel[] {
      return homeStatsMock;
    }
  }
  return new HomeStatsStub();
}

interface SutTypes {
  sut: DbGetHomeTeamStats,
  getHomeMatchesRepositoryStub: GetHomeMatchesRepository
  homeStatsStub: HomeStats
}

const makeSut = (): SutTypes => {
  const homeStatsStub = makeHomeStatsStub();
  const getHomeMatchesRepositoryStub = makeGetHomeMatchesRepositoryStub();
  const sut = new DbGetHomeTeamStats(
    getHomeMatchesRepositoryStub,
    homeStatsStub
  );
  return {
    sut,
    getHomeMatchesRepositoryStub,
    homeStatsStub
  }
};

describe('DbGetHomeTeamStats', () => {
  it('Should throw if GetHomeMatchesRepository throws', async () => {
    const { sut, getHomeMatchesRepositoryStub } = makeSut();
    jest.spyOn(getHomeMatchesRepositoryStub, 'findHomeMatches')
      .mockRejectedValueOnce(new Error());
    const promise = sut.handle();
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if HomeStats throws', async () => {
    const { sut, homeStatsStub } = makeSut();
    jest.spyOn(homeStatsStub, 'calculateHome')
      .mockImplementationOnce(() => { throw new Error()});
    const promise = sut.handle();
    await expect(promise).rejects.toThrow();
  });

  it('Should call HomeStats with correct values', async () => {
    const { sut, homeStatsStub } = makeSut();
    const calculateHomeSpy = jest.spyOn(homeStatsStub, 'calculateHome');
    await sut.handle();
    expect(calculateHomeSpy).toHaveBeenCalledWith(homeTeamDbResult);
  });

  it('Should return home teams stats order by points on success', async () => {
    const { sut } = makeSut();
    const homeTeamsStats = await sut.handle();
    expect(homeTeamsStats).toEqual(homeStatsMock);
  });
});
