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
  })
})
