import Team from '../../../database/models/Team';
import { StatsModel } from '../../models';

export interface HomeStats {
  calculateHome(teamsData: Team[]): StatsModel[]
}
