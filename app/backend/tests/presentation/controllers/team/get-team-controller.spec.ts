import GetTeamController from '../../../../src/presentation/controllers/team/get-team-controller'

interface SutTypes {
  sut: GetTeamController
}

const makeSut = (): SutTypes => {
  const sut = new GetTeamController();
  return {
    sut
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
  })
});
