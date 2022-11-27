import { MatchModel, TokenValidator } from '../../../../src/presentation/controllers/match/match-protocols';
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
  invalidHomeTeamHttpRequest,
  invalidAwayTeamHttpRequest,
  matchMock,
} from '../../../mocks/match-model-mock';
import { FindTeam } from '../../../../src/domain/usecases/find-teams';
import { TeamModel } from '../../../../src/domain/models/team';
import { teamMock } from '../../../mocks/team-model-mock';
import { AddMatch, AddMatchModel } from '../../../../src/domain/usecases/add-match'

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

const makeFindTeamStub = (): FindTeam => {
  class FindTeamStub implements FindTeam {
    async find(id: string): Promise<TeamModel | undefined> {
      return teamMock;
    }
  }
  return new FindTeamStub();
}

const makeAddMatchStub = (): AddMatch => {
  class AddMatchStub implements AddMatch {
    async add(matchData: AddMatchModel): Promise<MatchModel> {
      return matchMock;
    }
  }
  return new AddMatchStub();
}

interface SutTypes {
  sut: AddMatchController
  tokenValidatorStub: TokenValidator
  findTeamStub: FindTeam
  addMatchStub: AddMatch
}

const makeSut = (): SutTypes => {
  const addMatchStub = makeAddMatchStub();
  const tokenValidatorStub = makeTokenValidatorStub();
  const findTeamStub = makeFindTeamStub();
  const sut = new AddMatchController(
    tokenValidatorStub,
    findTeamStub,
    addMatchStub
  );
  return {
    sut,
    tokenValidatorStub,
    findTeamStub,
    addMatchStub
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

    it('Should return not found homeTeam has no match in the database', async () => {
      const { sut, findTeamStub } = makeSut();
      jest.spyOn(findTeamStub, 'find').mockResolvedValueOnce(undefined);
      const httpResponse = await sut.handle(invalidHomeTeamHttpRequest);
      expect(httpResponse.statusCode).toBe(404);
      expect(httpResponse.body)
        .toEqual({ message: 'There is no team with such id!' });
    });

    it('Should return not found awayTeam has no match in the database', async () => {
      const { sut, findTeamStub } = makeSut();
      jest.spyOn(findTeamStub, 'find')
        .mockResolvedValueOnce(teamMock)
        .mockResolvedValueOnce(undefined);
      const httpResponse = await sut.handle(invalidAwayTeamHttpRequest);
      expect(httpResponse.statusCode).toBe(404);
      expect(httpResponse.body)
        .toEqual({ message: 'There is no team with such id!' });
    });
  });
  it('Should return the match added on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(invalidAwayTeamHttpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body)
      .toEqual(matchMock);
  });
});
