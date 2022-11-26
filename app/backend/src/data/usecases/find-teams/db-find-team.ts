import { FindTeamRepository } from '../../protocols/find-teams-repository';
import { TeamModel } from '../../../domain/models/team';
import { FindTeam } from '../../../domain/usecases/find-teams';

export default class DbFindTeam implements FindTeam {
  constructor(private findTeamRepository: FindTeamRepository) {}
  async find(id: string): Promise<TeamModel | undefined> {
    return this.findTeamRepository.findOne(id);
  }
}
