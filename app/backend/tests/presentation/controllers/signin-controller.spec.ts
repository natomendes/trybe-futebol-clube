import SignInController from '../../../src/presentation/controllers/signin-controller'
import MissingParamError, { InvalidParamError } from '../../../src/presentation/errors'
import EmailValidator from '../../../src/presentation/protocols/email-validator'

interface SutTypes {
  sut: SignInController,
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignInController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
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
})
