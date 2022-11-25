import { TeamModel } from '../../../../src/domain/models/team'
import { getTeamsMock } from '../../../mocks/team-model-mock'
import { FindTeams } from '../../../../src/domain/usecases/find-teams'
import GetTeamsController from '../../../../src/presentation/controllers/team/get-teams-controller'

const makeFindTeamsStub = (): FindTeams => {
  class FindTeamsStub implements FindTeams {
    async find(): Promise<TeamModel[]> {
      return getTeamsMock;
    }
  }
  return new FindTeamsStub();
}

interface SutTypes {
  sut: GetTeamsController
  findTeamStub: FindTeams
}

const makeSut = (): SutTypes => {
  const findTeamStub = makeFindTeamsStub();
  const sut = new GetTeamsController(findTeamStub);
  return {
    sut,
    findTeamStub
  }
}

describe('GetTeamsController', () => {
  it('Should return server error if FindTeams throws', async () => {
    const { sut, findTeamStub } = makeSut();
    jest.spyOn(findTeamStub, 'find')
      .mockImplementationOnce(() => { throw new Error()})
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'})
  })
});

