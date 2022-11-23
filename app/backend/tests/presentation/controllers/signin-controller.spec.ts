import SignInController from '../../../src/presentation/controllers/signin-controller'
import MissingParamError from '../../../src/presentation/errors'
interface SutTypes {
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const sut = new SignInController();
  return {
    sut,
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


  it('Should return an error if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({ message: new MissingParamError().message}); 
  })
})
