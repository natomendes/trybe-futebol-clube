import JWTAdapter from '../../utils/jwt-adapter';
import AuthenticationController from '../../presentation/controllers/auth/auth-controller';
import DbFindUser from '../../data/usecases/find-user/db-find-user';
import UserRepository from '../../infra/db/user-repository/user';

const makeAuthController = (): AuthenticationController => {
  const tokenValidator = new JWTAdapter();
  const findUserRepository = new UserRepository();
  const findUser = new DbFindUser(findUserRepository);
  return new AuthenticationController(tokenValidator, findUser);
};

export default makeAuthController;
