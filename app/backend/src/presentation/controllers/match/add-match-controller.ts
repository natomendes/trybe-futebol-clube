import { JwtPayload } from 'jsonwebtoken';
import MissingParamError, {
  InvalidParamError,
  InvalidTokenError,
  MissingTokenError,
  ServerError,
} from '../../errors';
import {
  unauthorized,
  ok,
  serverError,
  badRequest,
  unprocessableEntity,
  notFound,
} from '../../helpers/http-helpers';
import { FindTeam } from '../team/get-teams-protocols';
import {
  Controller,
  TokenValidator,
  HttpRequest,
  HttpResponse,
  AddMatchReqBody,
} from './match-protocols';

export default class AddMatchController implements Controller {
  private readonly sameTeam = 'It is not possible to create a match with two equal teams';
  private readonly requiredParams = [
    'homeTeam',
    'awayTeam',
    'homeTeamGoals',
    'awayTeamGoals',
  ];

  constructor(
    private readonly tokenValidator: TokenValidator,
    private readonly findTeam: FindTeam,
  ) {}

  private validateToken(token: string | undefined): JwtPayload | undefined {
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

  private async validateTeams(homeTeam: string): Promise<boolean> {
    const isValidTeam = await this.findTeam.find(homeTeam);
    return !!isValidTeam;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = this.validateToken(httpRequest.headers.authorization);
      if (!token) return badRequest(new MissingTokenError());
      const areParamsValid = this.validateParams(httpRequest.body);
      if (!areParamsValid) return badRequest(new MissingParamError('Invalid request body'));
      const { homeTeam, awayTeam } = httpRequest.body;
      if (homeTeam === awayTeam) return unprocessableEntity(new InvalidParamError(this.sameTeam));
      if (!await this.validateTeams(homeTeam)) {
        return notFound(new InvalidParamError('There is no team with such id!'));
      }
      return ok(token);
    } catch (error) {
      if (error instanceof Error
        && error.name === 'TokenExpiredError') return unauthorized(new InvalidTokenError());
      return serverError(new ServerError());
    }
  }
}
