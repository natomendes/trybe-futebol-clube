import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeAddMatchController from '../factories/add-match-controller';
import makeGetMatchesController from '../factories/get-matches-controller';
import makeUpdateMatchController from '../factories/update-match-controller';

export default (router: Router): void => {
  router.get('/matches', adaptRoute(makeGetMatchesController()));
  router.post('/matches', adaptRoute(makeAddMatchController()));
  router.patch('/matches/:id', adaptRoute(makeUpdateMatchController()));
  router.patch('/matches/:id/finish', async (_req, res) => {
    res.status(200).json({});
  });
};
