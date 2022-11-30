import { StatsModel } from "../../../../src/domain/models";
import { GetTeamsStats } from "../../../../src/domain/usecases";
import { awayStatsMock, homeStatsMock } from "../../../mocks/leaderboard-model-mock";
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

interface SutTypes {
  sut: DbGetLeaderboard
  getTeamsStatsStub: GetTeamsStats
}

const makeSut = (): SutTypes => {
  const getTeamsStatsStub = makeGetTeamsStatsSutb();
  const sut = new DbGetLeaderboard(getTeamsStatsStub);
  return {
    sut,
    getTeamsStatsStub
  }  
}

describe('DbGetLeaderboard', () => {
  it('Should call DbGetTeamsStats with "home" argument on the first call', async () => {
    const { sut, getTeamsStatsStub } = makeSut();
    const handleSpy = jest.spyOn(getTeamsStatsStub, 'handle');
    await sut.handle();
    expect(handleSpy).toHaveBeenNthCalledWith(1, 'home');
  });
});
