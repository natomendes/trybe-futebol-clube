import { StatsModel, TeamModel } from "../../../../src/domain/models";
import { homeStatsMock, homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import { GetHomeMatches } from '../../../../src/data/protocols';
import DbGetHomeTeamStats from '../../../../src/data/usecases/leaderboard/db-get-home-team-stats';
import { HomeStats } from "../../../../src/domain/usecases";
import Team from "../../../../src/database/models/Team";

const makeGetHomeMatchesStub = (): GetHomeMatches => {
  class GetHomeMatchesStub implements GetHomeMatches {
    async findHomeMatches(): Promise<Team[]> {
      return homeTeamDbResult as any;
    }
  }

  return new GetHomeMatchesStub();
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
  getHomeMatchesStub: GetHomeMatches
  homeStatsStub: HomeStats
}

const makeSut = (): SutTypes => {
  const homeStatsStub = makeHomeStatsStub();
  const getHomeMatchesStub = makeGetHomeMatchesStub();
  const sut = new DbGetHomeTeamStats(
    getHomeMatchesStub,
    homeStatsStub
  );
  return {
    sut,
    getHomeMatchesStub,
    homeStatsStub
  }
};

describe('DbGetHomeTeamStats', () => {
  it('Should throw if GetHomeMatches throws', async () => {
    const { sut, getHomeMatchesStub } = makeSut();
    jest.spyOn(getHomeMatchesStub, 'findHomeMatches')
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

  it('Should return home teams stats order by points on success', async () => {
    const { sut } = makeSut();
    const homeTeamsStats = await sut.handle();
    expect(homeTeamsStats).toEqual(homeStatsMock);
  });
});
