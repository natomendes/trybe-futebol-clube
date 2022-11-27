import { UpdateMatchRepository } from '../../../../src/data/protocols'
import { UpdateMatchModel } from '../../../../src/domain/usecases';
import DbUpdateMatch from '../../../../src/data/usecases/matches/db-update-match';

const makeUpdateMatchRepository = (): UpdateMatchRepository => {
  class UpdateMatchRepositoryStub implements UpdateMatchRepository {
    async update(updateMatchdata: UpdateMatchModel): Promise<number> {
      return 1;
    }
  }
  return new UpdateMatchRepositoryStub();
}

interface SutTypes {
  sut: DbUpdateMatch,
  updateMatchRepositoryStub: UpdateMatchRepository
}

const makeSut = (): SutTypes => {
  const updateMatchRepositoryStub = makeUpdateMatchRepository();
  const sut = new DbUpdateMatch(updateMatchRepositoryStub);
  return {
    sut,
    updateMatchRepositoryStub
  }
}

describe('DbUpdateMatch', () => {
  it('Should call MatchRepository with correct values', async () => {
    const { sut, updateMatchRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateMatchRepositoryStub, 'update');
    await sut.update({
      id: '1',
      homeTeamGoals: '1',
      awayTeamGoals: '1',
    });
    expect(updateSpy).toHaveBeenCalledWith({
      id: '1',
      homeTeamGoals: '1',
      awayTeamGoals: '1',
    });
  });

  it('Should throw if UpdateMatchRepository throws', async () => {
    const { sut, updateMatchRepositoryStub } = makeSut();
    jest.spyOn(updateMatchRepositoryStub, 'update')
      .mockRejectedValueOnce(new Error());
    const promise = sut.update({
      id: '1',
      homeTeamGoals: '1',
      awayTeamGoals: '1',
    });
    await expect(promise).rejects.toThrow();
  });
});
