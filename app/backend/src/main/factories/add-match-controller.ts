import JWTAdapter from '../../utils/jwt-adapter';
import AddMatchController from '../../presentation/controllers/match/add-match-controller';
import DbFindTeam from '../../data/usecases/find-teams/db-find-team';
import TeamRepository from '../../infra/db/team-repository/team';
import DbAddMatch from '../../data/usecases/matches/db-add-match';
import MatchRepository from '../../infra/db/match-repository/match';

const makeAddMatchController = (): AddMatchController => {
  const tokenValidator = new JWTAdapter();

  const findTeamRepository = new TeamRepository();
  const findTeam = new DbFindTeam(findTeamRepository);

  const addMatchRepository = new MatchRepository();
  const addMatch = new DbAddMatch(addMatchRepository);
  return new AddMatchController(
    tokenValidator,
    findTeam,
    addMatch,
  );
};

export default makeAddMatchController;
