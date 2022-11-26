import { FindMatches, MatchModel } from '../../../../src/presentation/controllers/match/match-protocols';
import { allMatchesMock } from '../../../mocks/match-model-mock';
import GetMatchesController from '../../../../src/presentation/controllers/match/get-matches-controller';
import Match from '../../../../src/database/models/Match';

const makeFindMatchesStub = (): FindMatches => {
  class FindMatchesStub implements FindMatches {
    async find(): Promise<Match[]> {
      return allMatchesMock as any;
    }
  }

  return new FindMatchesStub();
}

interface SutTypes {
  sut: GetMatchesController
  findMatchesStub: FindMatches
}

const makeSut = (): SutTypes => {
  const findMatchesStub = makeFindMatchesStub();
  const sut = new GetMatchesController(findMatchesStub);
  return {
    sut,
    findMatchesStub
  }
}

describe('GetMatchesController', () => {
  it('Should return server error if FindMatches throws', async () => {
    const { sut, findMatchesStub } = makeSut();
    jest.spyOn(findMatchesStub, 'find')
      .mockImplementationOnce(() => { throw new Error()});
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'})
  });

  it('Should return all teams on success', async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(allMatchesMock);
  });
});
