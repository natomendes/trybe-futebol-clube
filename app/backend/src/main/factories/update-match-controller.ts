import MatchRepository from '../../infra/db/match-repository/match';
import DbUpdateMatch from '../../data/usecases/matches/db-update-match';
import UpdateMatchController from '../../presentation/controllers/match/update-match-controller';

const makeUpdateMatchController = (): UpdateMatchController => {
  const updateMatchRepository = new MatchRepository();
  const updateMatch = new DbUpdateMatch(updateMatchRepository);
  return new UpdateMatchController(updateMatch);
};

export default makeUpdateMatchController;
