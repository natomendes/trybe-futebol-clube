import TokenGeneratorAdapter from '../../../src/utils/jwt-adapter'
import * as jwt from 'jsonwebtoken';

describe('TokenGenerator Adapter', () => {
  it('Should return a valid token on generate', () => {
    jest.spyOn(jwt, 'sign')
      .mockImplementationOnce(() => 'valid_token')
    const sut = new TokenGeneratorAdapter();
    const response = sut.generate('valid_email@mail.com');
    expect(response).toBe('valid_token');
  });

  it('Should return user email on success', () => {
    const sut = new TokenGeneratorAdapter();
    jest.spyOn(jwt, 'verify')
      .mockImplementationOnce(() => ({ email: 'valid_mail@mail.com'}));
    const response = sut.validate('token');
    expect(response).toEqual({ email: 'valid_mail@mail.com'});
  });
})
