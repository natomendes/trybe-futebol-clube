import TokenGeneratorAdapter from '../../src/utils/token-generator-adapter'

jest.mock('jsonwebtoken', () => {
  const originalModule = jest.requireActual('jsonwebtoken');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    sign: jest.fn(() => 'valid_token'),
  };
});

describe('TokenGenerator Adapter', () => {
  it('Should return a valid token', () => {
    const sut = new TokenGeneratorAdapter();
    const response = sut.generate('valid_email@mail.com');
    expect(response).toBe('valid_token');
  })
})
