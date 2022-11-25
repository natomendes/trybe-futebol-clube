import { MissingTokenError, InvalidTokenError, InvalidParamError } from '../../../src/presentation/errors';
import AuthenticationController from '../../../src/presentation/controllers/auth-controller'
import { TokenValidator } from '../../../src/presentation/protocols/token';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { FindUser } from '../../../src/domain/usecases/find-user';
import UserModelMock from '../../mocks/user-model-mock';
import { UserModel } from '../../../src/domain/models/user';

const makeFindUserStub = (): FindUser => {
  class FindUserStub implements FindUser {
    async find(email: string): Promise<UserModel | undefined> {
      return await new Promise(resolves => {
        resolves(UserModelMock);
      });
    }
  }

  return new FindUserStub();
}

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
  sut: AuthenticationController,
  findUserStub: FindUser
}

const makeSut = (): SutTypes => {
  const findUserStub = makeFindUserStub();
  const tokenValidatorStub = makeTokenValidatorStub();
  const sut = new AuthenticationController(tokenValidatorStub, findUserStub);
  return {
    sut,
    tokenValidatorStub,
    findUserStub
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

  it('Should return not found if user dont exists on database', async () => {
    const { sut } = makeSut();
    const httpResquest = {
      headers: {
        authorization: 'valid_token'
      }
    }
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({ role: 'admin'});
  });

  it('Should return user role on success', async () => {
    const { sut, findUserStub } = makeSut();
    jest.spyOn(findUserStub, 'find')
      .mockResolvedValueOnce(undefined);
    const httpResquest = {
      headers: {
        authorization: 'valid_token'
      }
    }
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual({ message: 'User not found'});
  });
})
