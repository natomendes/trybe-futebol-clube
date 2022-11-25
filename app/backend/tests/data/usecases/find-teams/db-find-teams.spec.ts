import { FindTeamsRepository } from '../../../../src/data/protocols/find-teams-repository';
import DbFindTeams from '../../../../src/data/usecases/find-teams/db-find-teams'
import { TeamModel } from '../../../../src/domain/models/team';
import { getTeamsMock } from '../../../mocks/team-model-mock'

const makeFindTeamsRepositoryStub = (): FindTeamsRepository => {
  class FindTeamsRepositoryStub implements FindTeamsRepository {
    async find(): Promise<TeamModel[]> {
      return getTeamsMock;
    }
  }
  return new FindTeamsRepositoryStub();
}

interface SutTypes {
  sut: DbFindTeams,
  findTeamsRepositoryStub: FindTeamsRepository
}

const makeSut = (): SutTypes => {
  const findTeamsRepositoryStub = makeFindTeamsRepositoryStub();
  const sut = new DbFindTeams(findTeamsRepositoryStub);
  return {
    sut,
    findTeamsRepositoryStub
  }
}

describe('DbFindTeams', () => {
  it('Should throw if FindTeamsRepository throws', async () => {
    const { sut, findTeamsRepositoryStub } = makeSut();
    jest.spyOn(findTeamsRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((_res, rej) => {
        rej(new Error());
      }));
    const promise = sut.find();
    await expect(promise).rejects.toThrow();
  })
});
