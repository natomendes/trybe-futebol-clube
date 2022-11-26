import { FindMatchesRepository } from '../../../../src/data/protocols/find-matches-repository';
import Match from '../../../../src/database/models/Match';
import { allMatchesMock } from '../../../mocks/match-model-mock';
import DbFindMatches from '../../../../src/data/usecases/find-matches/db-find-matches';

const makeFindMatchesRepositoryStub = (): FindMatchesRepository => {
  class FindMatchesRepositoryStub implements FindMatchesRepository {
    async findAll(): Promise<Match[]> {
      return allMatchesMock as any;
    }
  }

  return new FindMatchesRepositoryStub();
}

interface SutTypes {
  sut: DbFindMatches,
  findMatchesRepositoryStub: FindMatchesRepository
}

const makeSut = (): SutTypes => {
  const findMatchesRepositoryStub = makeFindMatchesRepositoryStub();
  const sut = new DbFindMatches(findMatchesRepositoryStub);
  return {
    sut,
    findMatchesRepositoryStub
  }
}

describe('DbFindMatches', () => {
  it('Should throw if FindMatchesRepository throws', async () => {
    const { sut, findMatchesRepositoryStub } = makeSut();
    jest.spyOn(findMatchesRepositoryStub, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.find();
    await expect(promise).rejects.toThrow();
  });

  it('Should return all matches on success', async () => {
    const { sut } = makeSut();
    const matches = await sut.find();
    expect(matches).toEqual(allMatchesMock);
  });
});
