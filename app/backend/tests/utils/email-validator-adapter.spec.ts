import validator from 'validator';
import EmailValidatorAdapter from '../../src/utils/email-validator-adapter'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    const isValid = sut.isValid('valid_email@mail.com');
    expect(isValid).toBe(true);
  });
})
