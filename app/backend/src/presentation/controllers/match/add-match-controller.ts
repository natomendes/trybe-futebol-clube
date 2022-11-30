import { JwtPayload } from 'jsonwebtoken';
import {
  InvalidParamError,
  InvalidTokenError,
  MissingParamError,
  MissingTokenError,
  ServerError,
} from '../../errors';
import {
  unauthorized,
  serverError,
  badRequest,
  unprocessableEntity,
  notFound,
  created,
} from '../../helpers/http-helpers';
import {
  Controller,
  TokenValidator,
  HttpRequest,
  HttpResponse,
  AddMatchReqBody,
  FindTeam,
  AddMatch,
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
    private readonly addMatch: AddMatch,
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

  private async validateTeams(homeTeam: string, awayTeam: string): Promise<boolean> {
    const homeTeamReturn = await this.findTeam.find(homeTeam);
    const awayTeamReturn = await this.findTeam.find(awayTeam);

    return !!homeTeamReturn && !!awayTeamReturn;
  }

  async handle({ headers: { authorization }, body }: HttpRequest): Promise<HttpResponse> {
    try {
      if (!this.validateToken(authorization)) return badRequest(new MissingTokenError());

      const areParamsValid = this.validateParams(body);
      if (!areParamsValid) return badRequest(new MissingParamError('Invalid request body'));

      const { homeTeam, awayTeam } = body;
      if (homeTeam === awayTeam) return unprocessableEntity(new InvalidParamError(this.sameTeam));

      if (!await this.validateTeams(homeTeam, awayTeam)) {
        return notFound(new InvalidParamError('There is no team with such id!'));
      }
      const match = await this.addMatch.add(body);

      return created(match);
    } catch (error) {
      if (error instanceof Error
        && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
        return unauthorized(new InvalidTokenError());
      }

      return serverError(new ServerError());
    }
  }
}
