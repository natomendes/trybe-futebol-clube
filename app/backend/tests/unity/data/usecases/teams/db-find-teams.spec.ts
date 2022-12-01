import { FindTeamsRepository } from '../../../../../src/data/protocols/find-teams-repository';
import DbFindTeams from '../../../../../src/data/usecases/teams/db-find-teams';
import { TeamModel } from '../../../../../src/domain/models/team';
import { getTeamsMock } from '../../../mocks/team-model-mock';

const makeFindTeamsRepositoryStub = (): FindTeamsRepository => {
  class FindTeamsRepositoryStub implements FindTeamsRepository {
    async findAll(): Promise<TeamModel[]> {
      return getTeamsMock as any;
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
    jest.spyOn(findTeamsRepositoryStub, 'findAll')
      .mockReturnValueOnce(new Promise((_res, rej) => {
        rej(new Error());
      }));
    const promise = sut.find();
    await expect(promise).rejects.toThrow();
  });

  it('Should return all teams on success', async () => {
    const { sut } = makeSut();
    const matches = await sut.find();
    expect(matches).toEqual(getTeamsMock);
  });
});
