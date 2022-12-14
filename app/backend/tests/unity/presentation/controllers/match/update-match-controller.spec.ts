import { UpdateMatchModel, UpdateMatch } from '../../../../../src/presentation/controllers/match/match-protocols';
import UpdateMatchController from '../../../../../src/presentation/controllers/match/update-match-controller';

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
      headers: {},
      query: {},
      params: {
        id: 'valid_id',
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
      headers: {},
      query: {},
      params: {
        id: 'valid_id',
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
      headers: {},
      query: {},
      params: {
        id: 'invalid_id',
      },
      body: {
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual({ message: 'Match not found'});
  });

  it('Should call UpdateMacth with correct values', async () => {
    const { sut, updateMatchStub } = makeSut();
    const updateSpy = jest.spyOn(updateMatchStub, 'update');
    const httpRequest = {
      headers: {},
      query: {},
      params: {
        id: 'valid_id',
      },
      body: {
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      }
    };
    await sut.handle(httpRequest);
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'valid_id',
      homeTeamGoals: 1,
      awayTeamGoals: 1,
    });
  });

  it('Should return server error if UpdateMatch throws', async () => {
    const { sut, updateMatchStub } = makeSut();
    jest.spyOn(updateMatchStub, 'update')
      .mockRejectedValueOnce(new Error());
    const httpRequest = {
      headers: {},
      query: {},
      params: {
        id: 'valid_id',
      },
      body: {
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'});
  });

  it('Should return 200 and "Match updated with success" on success', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      headers: {},
      query: {},
      params: {
        id: 'valid_id',
      },
      body: {
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({ message: 'Match updated with success'});
  });
});
