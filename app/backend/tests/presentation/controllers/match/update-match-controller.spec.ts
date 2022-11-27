import UpdateMatchController from '../../../../src/presentation/controllers/match/update-match-controller';

interface SutTypes {
  sut: UpdateMatchController
}

const makeSut = (): SutTypes => {
  const sut = new UpdateMatchController();
  return {
    sut
  }
}

describe('UpdateMatchController', () => {
  it('Should return bad request if homeTeamGoals is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        id: '1',
      },
      body: {
        awayTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: 'Invalid request body'});
  })
});
