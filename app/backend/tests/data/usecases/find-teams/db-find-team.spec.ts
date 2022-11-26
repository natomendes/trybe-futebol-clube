import { FindTeamRepository } from '../../../../src/data/protocols/find-teams-repository';
import DbFindTeam from '../../../../src/data/usecases/find-teams/db-find-team'
import { TeamModel } from '../../../../src/domain/models/team';
import { teamMock } from '../../../mocks/team-model-mock'

const makeFindTeamRepositoryStub = (): FindTeamRepository => {
  class FindTeamRepositoryStub implements FindTeamRepository {
    async find(): Promise<TeamModel | undefined> {
      return teamMock;
    }
  }
  return new FindTeamRepositoryStub();
}

interface SutTypes {
  sut: DbFindTeam,
  findTeamRepositoryStub: FindTeamRepository
}

const makeSut = (): SutTypes => {
  const findTeamRepositoryStub = makeFindTeamRepositoryStub();
  const sut = new DbFindTeam(findTeamRepositoryStub);
  return {
    sut,
    findTeamRepositoryStub
  }
}

describe('DbFindTeams', () => {
  it('Should throw if FindTeamRepository throws', async () => {
    const { sut, findTeamRepositoryStub } = makeSut();
    jest.spyOn(findTeamRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((_res, rej) => {
        rej(new Error());
      }));
    const promise = sut.find('valid_id');
    await expect(promise).rejects.toThrow();
  });

  it('Should return undefined if no team is found', async () => {
    const { sut, findTeamRepositoryStub } = makeSut();
    jest.spyOn(findTeamRepositoryStub, 'find')
      .mockResolvedValueOnce(undefined);
    const team = await sut.find('valid_id');
    expect(team).toBeUndefined();
  });

  it('Should return a team on success', async () => {
    const { sut } = makeSut();
    const team = await sut.find('valid_id');
    expect(team).toEqual(teamMock);
  });
});
