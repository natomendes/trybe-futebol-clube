import TeamRepository from '../../infra/db/team-repository/team';
import DbFindTeams from '../../data/usecases/find-teams/db-find-teams';
import GetTeamsController from '../../presentation/controllers/team/get-teams-controller';

const makeGetTeamsController = (): GetTeamsController => {
  const findTeamsRepository = new TeamRepository();
  const findTeams = new DbFindTeams(findTeamsRepository);
  return new GetTeamsController(findTeams);
};

export default makeGetTeamsController;
