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
  })
});
