import { TokenValidator } from '../../../../src/presentation/controllers/match/match-protocols';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import AddMatchController from '../../../../src/presentation/controllers/match/add-match-controller';

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
  sut: AddMatchController
  tokenValidatorStub: TokenValidator
}

const makeSut = (): SutTypes => {
  const tokenValidatorStub = makeTokenValidatorStub();
  const sut = new AddMatchController(tokenValidatorStub);
  return {
    sut,
    tokenValidatorStub
  }
}

describe('AddMatchController', () => {
  it('Should return unauthorized if token is invalid', async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest.spyOn(tokenValidatorStub, 'validate')
      .mockImplementationOnce(() => { throw new TokenExpiredError('jwt expired', new Date())});
    const httpResquest = {
      headers: { 
        authorization: 'invalid_token'
      },
      body: {
        homeTeam: 16,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
      }
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual({ message: 'Token must be a valid token' });
  })
});
