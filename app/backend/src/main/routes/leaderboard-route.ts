import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeHomeTeamStatsController from '../factories/home-team-stats-controller';

export default (router: Router): void => {
  router.get('/leaderboard/home', adaptRoute(makeHomeTeamStatsController()));
};
