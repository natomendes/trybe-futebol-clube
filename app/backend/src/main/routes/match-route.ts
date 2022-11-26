import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeGetMatchesController from '../factories/get-matches-controller';

export default (router: Router): void => {
  router.get('/matches', adaptRoute(makeGetMatchesController()));
};
