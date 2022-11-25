import SignInController from '../../../src/presentation/controllers/sign-in/signin-controller';
import MissingParamError, { InvalidParamError, ServerError } from '../../../src/presentation/errors';
import { EmailValidator, FindUser, TokenGenerator } from '../../../src/presentation/controllers/sign-in/signin-protocols';
import { UserModel } from '../../../src/domain/models/user';
import UserModelMock from '../../mocks/user-model-mock';
import { Encrypter } from '../../../src/data/protocols/encrypter'


const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeFindUser = (): FindUser => {
  class FindUserStub implements FindUser {
    async find(email: string): Promise<UserModel | undefined> {
      return await new Promise(resolves => {
        resolves(UserModelMock);
      });
    }
  }

  return new FindUserStub();
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate(email: string): string {
      return 'valid_token'
    }
  }

  return new TokenGeneratorStub();
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async validate(password: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => {
        resolve(true);
      });
    }
  }
  return new EncrypterStub();
}

interface SutTypes {
  sut: SignInController,
  emailValidatorStub: EmailValidator,
  findUserStub: FindUser,
  tokenGeneratorStub: TokenGenerator,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const tokenGeneratorStub = makeTokenGenerator();
  const emailValidatorStub = makeEmailValidator();
  const findUserStub = makeFindUser();
  const sut = new SignInController(
    emailValidatorStub,
    findUserStub,
    tokenGeneratorStub,
    encrypterStub
  );
  return {
    sut,
    emailValidatorStub,
    findUserStub,
    tokenGeneratorStub,
    encrypterStub
  }
}

describe('SignIn Controller', () => {
  it('Should return an error if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'valid_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new MissingParamError().message}); 
  });

  it('Should return an error if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new MissingParamError().message}); 
  });

  it('Should return an error if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'valid_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new InvalidParamError().message}); 
  });

  it('Should return an error if email provided has no match in the database', async () => {
    const { sut, findUserStub } = makeSut();
    jest.spyOn(findUserStub, 'find')
      .mockResolvedValueOnce(undefined)
    const httpRequest = {
      body: {
        email: 'no_user@mail.com',
        password: 'valid_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual({ message: new InvalidParamError().message}); 
  });

  it('Should return an error if password provided doesnt match user password', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'validate')
      .mockResolvedValueOnce(false);
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'invalid_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual({ message: new InvalidParamError().message}); 
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'valid_password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual({ message: new ServerError().message })
  });

  it('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut();
    const isValidPasswordSpy = jest.spyOn(encrypterStub, 'validate');
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }
    };
    await sut.handle(httpRequest);
    expect(isValidPasswordSpy).toHaveBeenCalledWith('valid_password', 'hashed_password');
  });

  it('Should return a token on success', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'hashed_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({ token: 'valid_token'});
  });
})
