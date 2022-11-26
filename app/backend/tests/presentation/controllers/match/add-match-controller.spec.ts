import { TokenValidator } from '../../../../src/presentation/controllers/match/match-protocols';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import AddMatchController from '../../../../src/presentation/controllers/match/add-match-controller';
import {
  invalidTokenHttpRequest,
  missingHomeTeamParamHttpRequest,
  missingTokenHttpRequest,
  missingAwayTeamParamHttpRequest,
  missingHomeTeamGoalsParamHttpRequest,
  missingAwayTeamGoalsParamHttpRequest,
  sameTeamHttpRequest,
} from '../../../mocks/match-model-mock';

const makeTokenValidatorStub = (): TokenValidator => {
  class TokenValidatorStub implements TokenValidator {
    validate(token: string): JwtPayload {
      return {
        email: 'valid_mail@mail.com'
      }
    }
  }
  return new TokenValidatorStub();
};

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
  describe('Request Validation', () => {  
    it('Should return bad request if no token is provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(missingTokenHttpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual({ message: 'Token is required' });
    });

    it('Should return unauthorized if token is invalid', async () => {
      const { sut, tokenValidatorStub } = makeSut();
      jest.spyOn(tokenValidatorStub, 'validate')
        .mockImplementationOnce(() => { throw new TokenExpiredError('jwt expired', new Date())});
      const httpResponse = await sut.handle(invalidTokenHttpRequest);
      expect(httpResponse.statusCode).toBe(401);
      expect(httpResponse.body).toEqual({ message: 'Token must be a valid token' });
    });

    it('Should return bad request if homeTeam is not provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(missingHomeTeamParamHttpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual({ message: 'Invalid request body' });
    });

    it('Should return bad request if awayTeam is not provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(missingAwayTeamParamHttpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual({ message: 'Invalid request body' });
    });

    it('Should return bad request if homeTeamGoals is not provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(missingHomeTeamGoalsParamHttpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual({ message: 'Invalid request body' });
    });

    it('Should return bad request if awayTeamGoals is not provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(missingAwayTeamGoalsParamHttpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual({ message: 'Invalid request body' });
    });
  });
  describe('Match information validation', () => {
    it('Should return unprocessable entity if homeTeam is equal to awayTeam', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(sameTeamHttpRequest);
      expect(httpResponse.statusCode).toBe(422);
      expect(httpResponse.body)
        .toEqual({ message: 'It is not possible to create a match with two equal teams' });
    });
  });
  
});
