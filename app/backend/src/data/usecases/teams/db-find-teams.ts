import { FindTeamsRepository, TeamModel, FindTeams } from './find-teams-protocols';

export default class DbFindTeams implements FindTeams {
  constructor(
    private findTeamsRepository: FindTeamsRepository,
  ) {}

  async find(): Promise<TeamModel[]> {
    return this.findTeamsRepository.findAll();
  }
}
