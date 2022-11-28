import { FinishMatchRepository } from '../../../../src/data/usecases/matches/match-protocols'
import DbFinishMatch from '../../../../src/data/usecases/matches/db-finish-match';

const makeFinishMatchRepository = (): FinishMatchRepository => {
  class FinishMatchRepositoryStub implements FinishMatchRepository {
    async finish(_id: string): Promise<number> {
      return 1;
    }
  }
  return new FinishMatchRepositoryStub();
}

interface SutTypes {
  sut: DbFinishMatch,
  finishMatchRepositoryStub: FinishMatchRepository
}

const makeSut = (): SutTypes => {
  const finishMatchRepositoryStub = makeFinishMatchRepository();
  const sut = new DbFinishMatch(finishMatchRepositoryStub);
  return {
    sut,
    finishMatchRepositoryStub
  }
}

describe('DbFinishMatch', () => {
  it('Should call FinishMatchRepository with correct value', async () => {
    const { sut, finishMatchRepositoryStub } = makeSut();
    const finishSpy = jest.spyOn(finishMatchRepositoryStub, 'finish');
    await sut.finish('valid_id');
    expect(finishSpy).toHaveBeenCalledWith('valid_id');
  });

  it('Should throw if FinishMatchRepository throws', async () => {
    const { sut, finishMatchRepositoryStub } = makeSut();
    jest.spyOn(finishMatchRepositoryStub, 'finish')
      .mockRejectedValueOnce(new Error());
    const promise = sut.finish('valid_id');
    await expect(promise).rejects.toThrow();
  });

  it('Should return the number of affected rows on success', async () => {
    const { sut } = makeSut();
    const affectedRows = await sut.finish('valid_id');
    expect(affectedRows).toBe(1);
  });
});
