import { TeamModel } from '../../../../src/domain/models/team';
import { FindTeam } from '../../../../src/domain/usecases/find-teams';
import GetTeamController from '../../../../src/presentation/controllers/team/get-team-controller'
import { teamMock } from '../../../mocks/team-model-mock'
const makeFindTeamStub = (): FindTeam => {
  class FindTeamStub implements FindTeam {
    async find(id: string): Promise<TeamModel | undefined> {
      return teamMock;
    }
  }
  return new FindTeamStub();
}

interface SutTypes {
  sut: GetTeamController
  findTeamStub: FindTeam
}

const makeSut = (): SutTypes => {
  const findTeamStub = makeFindTeamStub();
  const sut = new GetTeamController(findTeamStub);
  return {
    sut,
    findTeamStub
  }
}

describe('GetTeamController', () => {
  it('Should return bad request if no id is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        id: '',
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: 'Missing param "id"'});
  });

  it('Should return not found if no team is found with the id provided', async () => {
    const { sut, findTeamStub } = makeSut();
    jest.spyOn(findTeamStub, 'find').mockResolvedValueOnce(undefined);
    const httpRequest = {
      params: {
        id: 'no_team_id',
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual({ message: 'Team not found'});
  });
});
