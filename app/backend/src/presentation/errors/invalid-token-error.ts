export default class InvalidTokenError extends Error {
  constructor() {
    super('Token must be a valid token');
    this.name = 'InvalidToken';
  }
}
