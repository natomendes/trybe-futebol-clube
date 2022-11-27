import { addMatchMock, matchMock } from "../../../mocks/match-model-mock"
import { AddMatchRepository } from '../../../../src/data/protocols/add-match-repository'
import { MatchModel } from "../../../../src/domain/models/match"
import { AddMatchModel } from "../../../../src/domain/usecases/add-match"
import DbAddMatch from '../../../../src/data/usecases/matches/db-add-match'
const makeAddMatchRepository = (): AddMatchRepository => {
  class AddMatchRepositoryStub implements AddMatchRepository {
    async add(matchData: AddMatchModel): Promise<MatchModel> {
      return matchMock
    }
  }
  return new AddMatchRepositoryStub();
}

interface SutTypes {
  sut: DbAddMatch,
  addMatchRepositoryStub: AddMatchRepository
}

const makeSut = (): SutTypes => {
  const addMatchRepositoryStub = makeAddMatchRepository();
  const sut = new DbAddMatch(addMatchRepositoryStub);
  return {
    sut,
    addMatchRepositoryStub
  }
}

describe('DbAddMatch', () => {
  it('Should call AddMatchRepository with correce values', async () => {
    const { sut, addMatchRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addMatchRepositoryStub, 'add');
    await sut.add(addMatchMock);
    expect(addSpy).toHaveBeenCalledWith(addMatchMock);
  })
});
