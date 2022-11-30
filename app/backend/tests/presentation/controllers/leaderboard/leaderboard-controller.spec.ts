import { StatsModel } from "../../../../src/domain/models";
import { homeStatsMock } from '../../../mocks/leaderboard-model-mock';
import { GetLeaderboard } from '../../../../src/domain/usecases';
import LeaderboardController from '../../../../src/presentation/controllers/leaderboard/leaderboard-controller'

const makeGetLeaderboardSutb = (): GetLeaderboard => {
  class GetLeaderboardStub implements GetLeaderboard {
    async handle(): Promise<StatsModel[]> {
      return homeStatsMock;
    }
  }

  return new GetLeaderboardStub();
};

interface SutTypes {
  sut: LeaderboardController
  getLeaderboardStub: GetLeaderboard
}

const makeSut = (): SutTypes => {
  const getLeaderboardStub = makeGetLeaderboardSutb();
  const sut = new LeaderboardController(getLeaderboardStub);
  return {
    sut,
    getLeaderboardStub
  }
};

describe('LeaderboardController', () => {
  it('Should return server error if GetLeaderboard throws', async () => {
    const { sut, getLeaderboardStub } = makeSut();
    jest.spyOn(getLeaderboardStub, 'handle')
      .mockRejectedValueOnce(new Error());
    const httpRequest = {
      body: {
        path: 'leaderboard'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'});
  })
});
