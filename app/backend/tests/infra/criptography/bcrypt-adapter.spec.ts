import * as bcrypt from 'bcryptjs';
import BcryptAdapter from '../../../src/infra/criptography/bcrypt-adapter';

jest.mock('bcryptjs', () => {
  const originalModule = jest.requireActual('bcryptjs');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    compare: jest.fn()
      .mockImplementationOnce(async () => true)
      .mockImplementationOnce(async () => false)
      .mockImplementationOnce(async () => true),
  };
});

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.validate('password', 'hashed_password');
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  });

  it('Should return false if bcrypt.compare returns false', async () => {
    const sut = makeSut();
    const isValid = await sut.validate('password', 'hashed_password');
    expect(isValid).toBe(false)
  });

  // it('Should return true if bcrypt.compare returns true', async () => {
  //   const sut = makeSut();
  //   const isValid = await sut.validate('password', 'hashed_password');
  //   expect(isValid).toBe(true)
  // });
})
