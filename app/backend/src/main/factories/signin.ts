import EmailValidatorAdapter from '../../utils/email-validator-adapter';
import SignInController from '../../presentation/controllers/signin-controller';
import DbFindUser from '../../data/usecases/find-user/db-find-user';
import UserRepository from '../../infra/db/user-repository/user';
import JWTAdapter from '../../utils/jwt-adapter';
import BcryptAdapter from '../../infra/criptography/bcrypt-adapter';

const makeSignInController = (): SignInController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const findUserRepository = new UserRepository();
  const findUser = new DbFindUser(findUserRepository);
  const tokenGenerator = new JWTAdapter();
  const encrypter = new BcryptAdapter(salt);

  return new SignInController(
    emailValidator,
    findUser,
    tokenGenerator,
    encrypter,
  );
};

export default makeSignInController;
