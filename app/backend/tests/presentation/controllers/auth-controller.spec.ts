import { MissingTokenError, InvalidTokenError } from '../../../src/presentation/errors';
import AuthenticationController from '../../../src/presentation/controllers/auth-controller'
import { TokenValidator } from '../../../src/presentation/protocols/token';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

const makeTokenValidatorStub = (): TokenValidator => {
  class TokenValidatorStub implements TokenValidator {
    validate(token: string): JwtPayload {
      return {
        email: 'valid_mail@mail.com'
      }
    }
  }
  return new TokenValidatorStub();
}

interface SutTypes {
  tokenValidatorStub: TokenValidator
  sut: AuthenticationController
}

const makeSut = (): SutTypes => {
  const tokenValidatorStub = makeTokenValidatorStub();
  const sut = new AuthenticationController(tokenValidatorStub);
  return {
    sut,
    tokenValidatorStub,
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

  it('Should return unauthorized if token is invalid', async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest.spyOn(tokenValidatorStub, 'validate')
      .mockImplementationOnce(() => { throw new TokenExpiredError('jwt expired', new Date())})
    const httpResquest = {
      headers: { 
        authorization: 'invalid_token'
      }
    }
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual({ message: new InvalidTokenError().message})
  });
})
