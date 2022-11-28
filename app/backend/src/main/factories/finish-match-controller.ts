import MatchRepository from '../../infra/db/match-repository/match';
import DbFinishMatch from '../../data/usecases/matches/db-finish-match';
import FinishMatchController from '../../presentation/controllers/match/finish-match-controller';

const makeFinishMatchController = (): FinishMatchController => {
  const finishMatchRepository = new MatchRepository();
  const finishMatch = new DbFinishMatch(finishMatchRepository);
  return new FinishMatchController(finishMatch);
};

export default makeFinishMatchController;
