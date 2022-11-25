import { FindTeamsRepository } from '../../protocols/find-teams-repository';
import { TeamModel } from '../../../domain/models/team';
import { FindTeams } from '../../../domain/usecases/find-teams';

export default class DbFindTeams implements FindTeams {
  constructor(
    private findTeamsRepository: FindTeamsRepository,
  ) {}

  async find(): Promise<TeamModel[]> {
    return this.findTeamsRepository.find();
  }
}
