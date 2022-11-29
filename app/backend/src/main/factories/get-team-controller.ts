import TeamRepository from '../../infra/db/team-repository/team';
import DbFindTeam from '../../data/usecases/teams/db-find-team';
import GetTeamController from '../../presentation/controllers/team/get-team-controller';

const makeGetTeamController = (): GetTeamController => {
  const findTeamRepository = new TeamRepository();
  const findTeam = new DbFindTeam(findTeamRepository);
  return new GetTeamController(findTeam);
};

export default makeGetTeamController;
