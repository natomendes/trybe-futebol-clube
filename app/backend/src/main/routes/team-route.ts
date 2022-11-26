import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeGetTeamController from '../factories/get-team-controller';
import makeGetTeamsController from '../factories/get-teams';

export default (router: Router): void => {
  router.get('/teams/:id', adaptRoute(makeGetTeamController()));
  router.get('/teams', adaptRoute(makeGetTeamsController()));
};
