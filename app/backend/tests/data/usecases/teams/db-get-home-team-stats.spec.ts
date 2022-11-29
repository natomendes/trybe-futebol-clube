import { StatsModel, TeamModel } from "../../../../src/domain/models";
import { awayStatsMock, homeStatsMock, homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import { GetTeamsMatchesRepository } from '../../../../src/data/protocols';
import DbGetTeamsStats from '../../../../src/data/usecases/teams/db-get-home-team-stats';
import { TeamStats } from "../../../../src/domain/usecases";
import Team from "../../../../src/database/models/Team";

const makeGetTeamsMatchesRepositoryStub = (): GetTeamsMatchesRepository => {
  class GetTeamsMatchesRepositoryStub implements GetTeamsMatchesRepository {
    async findMatches(): Promise<Team[]> {
      return homeTeamDbResult as any;
    }
  }

  return new GetTeamsMatchesRepositoryStub();
}

const makeHomeStatsStub = (): TeamStats => {
  class HomeStatsStub implements TeamStats {
    calculateHome(teamsData: TeamModel[]): StatsModel[] {
      return homeStatsMock;
    }
    calculateAway(teamsData: TeamModel[]): StatsModel[] {
      return awayStatsMock;
    }
  }
  return new HomeStatsStub();
}

interface SutTypes {
  sut: DbGetTeamsStats,
  getTeamsMatchesRepositoryStub: GetTeamsMatchesRepository
  homeStatsStub: TeamStats
}

const makeSut = (): SutTypes => {
  const homeStatsStub = makeHomeStatsStub();
  const getTeamsMatchesRepositoryStub = makeGetTeamsMatchesRepositoryStub();
  const sut = new DbGetTeamsStats(
    getTeamsMatchesRepositoryStub,
    homeStatsStub
  );
  return {
    sut,
    getTeamsMatchesRepositoryStub,
    homeStatsStub
  }
};

describe('DbGetTeamsStats', () => {
  it('Should throw if GetTeamsMatchesRepository throws', async () => {
    const { sut, getTeamsMatchesRepositoryStub } = makeSut();
    jest.spyOn(getTeamsMatchesRepositoryStub, 'findMatches')
      .mockRejectedValueOnce(new Error());
    const promise = sut.handle('home');
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if HomeStats throws', async () => {
    const { sut, homeStatsStub } = makeSut();
    jest.spyOn(homeStatsStub, 'calculateHome')
      .mockImplementationOnce(() => { throw new Error()});
    const promise = sut.handle('home');
    await expect(promise).rejects.toThrow();
  });

  it('Should call HomeStats with correct values', async () => {
    const { sut, homeStatsStub } = makeSut();
    const calculateHomeSpy = jest.spyOn(homeStatsStub, 'calculateHome');
    await sut.handle('home');
    expect(calculateHomeSpy).toHaveBeenCalledWith(homeTeamDbResult);
  });

  it('Should return home teams stats order by points on success', async () => {
    const { sut } = makeSut();
    const homeTeamsStats = await sut.handle('home');
    expect(homeTeamsStats).toEqual(homeStatsMock);
  });
});
