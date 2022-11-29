import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeHomeAwayStatsController from '../factories/home-away-stats-controller';

export default (router: Router): void => {
  router.get('/leaderboard/home', adaptRoute(makeHomeAwayStatsController()));
  router.get('/leaderboard/away', adaptRoute(makeHomeAwayStatsController()));
};
