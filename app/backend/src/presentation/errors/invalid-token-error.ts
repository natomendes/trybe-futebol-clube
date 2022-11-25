export default class InvalidTokenError extends Error {
  constructor() {
    super('Invalid');
    this.name = 'InvalidToken';
  }
}
