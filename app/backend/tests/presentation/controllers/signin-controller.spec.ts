import SignInController from '../../../src/presentation/controllers/signin-controller'
import MissingParamError, { InvalidParamError } from '../../../src/presentation/errors'
import EmailValidator from '../../../src/presentation/protocols/email-validator'
import UserModel from '../../../src/domain/models/user'
import FindUser from '../../../src/domain/usecases/find-user'

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
        resolves({
        id: 1,
        username: 'username',
        email: 'usermail@mail.com',
        role: 'admin',
        password: 'hashed_password'
        });
      });
    }
  }

  return new FindUserStub();
}

interface SutTypes {
  sut: SignInController,
  emailValidatorStub: EmailValidator,
  findUserStub: FindUser
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const findUserStub = makeFindUser();
  const sut = new SignInController(emailValidatorStub, findUserStub);
  return {
    sut,
    emailValidatorStub,
    findUserStub
  }
}

describe('SignIn Controller', () => {
  it('Should return an error if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new MissingParamError().message}); 
  });

  it('Should return an error if no email is provided', async () => {
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
        email: 'any_email@mail.com',
        password: 'any_password',
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
        password: 'any_password',
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
        email: 'no_user@mail.com',
        password: 'any_password',
      }
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('no_user@mail.com');
  });
})
