import EmailValidatorAdapter from '../../utils/email-validator-adapter';
import SignInController from '../../presentation/controllers/signin-controller';
import DbFindUser from '../../data/usecases/find-user/db-find-user';
import UserRepository from '../../infra/db/user-repository/user';
import TokenGeneratorAdapter from '../../utils/token-generator-adapter';

const makeSignInController = (): SignInController => {
  const emailValidator = new EmailValidatorAdapter();
  const findUserRepository = new UserRepository();
  const findUser = new DbFindUser(findUserRepository);
  const tokenGenerator = new TokenGeneratorAdapter();

  return new SignInController(emailValidator, findUser, tokenGenerator);
};

export default makeSignInController;
