import { StatsModel } from "../../../../src/domain/models";
import { GetTeamsStats, GetLeaderboardStats } from "../../../../src/domain/usecases";
import { awayStatsMock, homeStatsMock, leaderboardMock } from "../../../mocks/leaderboard-model-mock";
import DbGetLeaderboard from '../../../../src/data/usecases/teams/db-get-leaderboard';

const makeGetTeamsStatsSutb = (): GetTeamsStats => {
  class GetTeamsStatsStub implements GetTeamsStats {
    async handle(path: string): Promise<StatsModel[]> {
      if (path === 'home') {
        return homeStatsMock;
      } else {
        return awayStatsMock;
      }
    }
  }

  return new GetTeamsStatsStub();
}

const makeGetLeaderboardStatsStub = (): GetLeaderboardStats => {
  class GetLeaderboardStatsStub implements GetLeaderboardStats {
    async handle(homeStats: StatsModel[], awayStats: StatsModel[]): Promise<StatsModel[]> {
      return leaderboardMock;
    }
  }
  return new GetLeaderboardStatsStub();
}

interface SutTypes {
  sut: DbGetLeaderboard
  getTeamsStatsStub: GetTeamsStats
  getLeaderboardStatsStub: GetLeaderboardStats
}

const makeSut = (): SutTypes => {
  const getLeaderboardStatsStub = makeGetLeaderboardStatsStub();
  const getTeamsStatsStub = makeGetTeamsStatsSutb();
  const sut = new DbGetLeaderboard(getTeamsStatsStub, getLeaderboardStatsStub);
  return {
    sut,
    getTeamsStatsStub,
    getLeaderboardStatsStub
  }  
}

describe('DbGetLeaderboard', () => {
  it('Should call GetTeamsStats with "home" argument on the first call', async () => {
    const { sut, getTeamsStatsStub } = makeSut();
    const handleSpy = jest.spyOn(getTeamsStatsStub, 'handle');
    await sut.handle();
    expect(handleSpy).toHaveBeenNthCalledWith(1, 'home');
  });

  it('Should call GetTeamsStats with "away" argument on the second call', async () => {
    const { sut, getTeamsStatsStub } = makeSut();
    const handleSpy = jest.spyOn(getTeamsStatsStub, 'handle');
    await sut.handle();
    expect(handleSpy).toHaveBeenNthCalledWith(2, 'away');
  });

  it('Should call GetLeaderboardStats with correct values', async () => {
    const { sut, getLeaderboardStatsStub } = makeSut();
    const handleSpy = jest.spyOn(getLeaderboardStatsStub, 'handle');
    await sut.handle()
    expect(handleSpy).toHaveBeenCalledWith(homeStatsMock, awayStatsMock);
  });
});
