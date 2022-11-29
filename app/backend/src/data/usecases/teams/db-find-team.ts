import { FindTeamRepository, TeamModel, FindTeam } from './find-teams-protocols';

export default class DbFindTeam implements FindTeam {
  constructor(private findTeamRepository: FindTeamRepository) {}
  async find(id: string): Promise<TeamModel | undefined> {
    return this.findTeamRepository.findOne(id);
  }
}
