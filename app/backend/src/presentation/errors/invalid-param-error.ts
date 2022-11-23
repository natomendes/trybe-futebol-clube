export default class InvalidParamError extends Error {
  constructor() {
    super('Incorrect email or password');
    this.name = 'Invalid Param';
  }
}
