import SignInController from '../../../src/presentation/controllers/signin-controller'

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
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);    
  })
})
