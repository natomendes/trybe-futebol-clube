import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeGetTeamsController from '../factories/get-teams';

export default (router: Router): void => {
  router.get('/teams', adaptRoute(makeGetTeamsController()));
};
