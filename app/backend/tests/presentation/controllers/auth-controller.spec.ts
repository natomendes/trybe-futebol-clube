import { MissingTokenError } from '../../../src/presentation/errors';
import AuthenticationController from '../../../src/presentation/controllers/auth-controller'

interface SutTypes {
  sut: AuthenticationController
}

const makeSut = (): SutTypes => {
  const sut = new AuthenticationController();
  return {
    sut,
  }
}

describe('AuthenticantionController', () => {
  it('Should return a bad request if no token is provided', async () => {
    const { sut } = makeSut();
    const httpResquest = {
      headers: { }
    }
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new MissingTokenError().message})
  });
})
