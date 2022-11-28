import { FinishMatch } from '../../../../src/presentation/controllers/match/match-protocols';
import FinishMatchController from '../../../../src/presentation/controllers/match/finish-match-controller';

const makeFinishMatchStub = (): FinishMatch => {
  class FinishMatchStub implements FinishMatch {
    async finish(id: string): Promise<number> {
      return 1;
    }
  }

  return new FinishMatchStub();
}

interface SutTypes {
  sut: FinishMatchController
  finishMatchStub: FinishMatch
}

const makeSut = (): SutTypes => {
  const finishMatchStub = makeFinishMatchStub();
  const sut = new FinishMatchController(finishMatchStub);
  return {
    sut,
    finishMatchStub
  };
}

describe('FinishMatchController', () => {
  it('Should call FinishMatch with correct value', async () => {
    const { sut, finishMatchStub } = makeSut();
    const finishSpy = jest.spyOn(finishMatchStub, 'finish');
    const httpRequest = {
      params: {
        id: 'valid_id'
      }
    }
    await sut.handle(httpRequest);
    expect(finishSpy).toHaveBeenCalledWith('valid_id');
  });

  it('Should return server error if FinishMatch throws', async () => {
    const { sut, finishMatchStub } = makeSut();
    jest.spyOn(finishMatchStub, 'finish')
      .mockRejectedValueOnce(new Error());
    const httpRequest = {
      params: {
        id: 'valid_id'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({ message: 'Internal server error'});
  });

  it('Should return not found if no match is found with id provided', async () => {
    const { sut, finishMatchStub } = makeSut();
    jest.spyOn(finishMatchStub, 'finish')
      .mockResolvedValueOnce(0);
    const httpRequest = {
      params: {
        id: 'valid_id'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual({ message: 'Match not found'});
  });

  it('Should return 200 and "Finished" on success', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        id: 'valid_id'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({ message: 'Finished'});
  });
});
