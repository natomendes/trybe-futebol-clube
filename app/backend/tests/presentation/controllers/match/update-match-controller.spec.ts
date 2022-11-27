import { UpdateMatchModel, UpdateMatch } from '../../../../src/presentation/controllers/match/match-protocols';
import UpdateMatchController from '../../../../src/presentation/controllers/match/update-match-controller';

const makeUpdateMatchStub = (): UpdateMatch => {
  class UpdateMatchStub implements UpdateMatch {
    async update(updateMatchData: UpdateMatchModel): Promise<number> {
      return 1;
    }
  }

  return new UpdateMatchStub();
}

interface SutTypes {
  sut: UpdateMatchController
  updateMatchStub: UpdateMatch
}

const makeSut = (): SutTypes => {
  const updateMatchStub = makeUpdateMatchStub();
  const sut = new UpdateMatchController(updateMatchStub);
  return {
    sut,
    updateMatchStub
  };
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
  });

  it('Should return bad request if awayTeamGoals is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        id: '1',
      },
      body: {
        homeTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: 'Invalid request body'});
  });

  it('Should return not found if no match is found with id provided', async () => {
    const { sut, updateMatchStub } = makeSut();
    jest.spyOn(updateMatchStub, 'update').mockResolvedValueOnce(0);
    const httpRequest = {
      params: {
        id: 'invalid_id',
      },
      body: {
        homeTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: 'Invalid request body'});
  });
});
