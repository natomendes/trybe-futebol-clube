export default class InvalidParamError extends Error {
  constructor(
    message = 'Incorrect email or password',
  ) {
    super(message);
    this.name = 'Invalid Param';
  }
}
