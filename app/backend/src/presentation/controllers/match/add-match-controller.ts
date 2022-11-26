import { JwtPayload } from 'jsonwebtoken';
import MissingParamError, { InvalidTokenError, MissingTokenError, ServerError } from '../../errors';
import { unauthorized, ok, serverError, badRequest } from '../../helpers/http-helpers';
import {
  Controller,
  TokenValidator,
  HttpRequest,
  HttpResponse,
  AddMatchReqBody,
} from './match-protocols';

export default class AddMatchController implements Controller {
  private readonly requiredParams = [
    'homeTeam',
    'awayTeam',
    'homeTeamGoals',
    'awayTeamGoals',
  ];

  constructor(private readonly tokenValidator: TokenValidator) {}

  private checkToken(token: string | undefined): JwtPayload | undefined {
    if (!token) return undefined;

    return this.tokenValidator.validate(token);
  }

  private validateParams(fields: AddMatchReqBody): boolean {
    for (let i = 0; i < this.requiredParams.length; i += 1) {
      if (!fields[this.requiredParams[i] as keyof AddMatchReqBody]) {
        return false;
      }
    }
    return true;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = this.checkToken(httpRequest.headers.authorization);
      if (!token) return badRequest(new MissingTokenError());
      const areParamsValid = this.validateParams(httpRequest.body);
      if (!areParamsValid) return badRequest(new MissingParamError('Invalid request body'));

      return ok(token);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return unauthorized(new InvalidTokenError());
      }
      return serverError(new ServerError());
    }
  }
}
