import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeSignInController from '../factories/signin';

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeSignInController()));
};
