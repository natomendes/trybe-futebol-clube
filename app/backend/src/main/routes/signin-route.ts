import { Router } from 'express';
import adaptRoute from '../adapters/express-route-adapter';
import makeAuthController from '../factories/auth-controller';
import makeSignInController from '../factories/signin';

export default (router: Router): void => {
  router.get('/login/validate', adaptRoute(makeAuthController()));
  router.post('/login', adaptRoute(makeSignInController()));
};
