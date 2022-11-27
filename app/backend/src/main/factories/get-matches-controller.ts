import MatchRepository from '../../infra/db/match-repository/match';
import DbFindMatches from '../../data/usecases/matches/db-find-matches';
import GetMatchesController from '../../presentation/controllers/match/get-matches-controller';

const makeGetMatchesController = (): GetMatchesController => {
  const findMatchesRepository = new MatchRepository();
  const dbFindMatches = new DbFindMatches(findMatchesRepository);
  return new GetMatchesController(dbFindMatches);
};

export default makeGetMatchesController;
