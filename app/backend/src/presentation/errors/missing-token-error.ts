export default class MissingTokenError extends Error {
  constructor() {
    super('Token is required');
    this.name = 'MissingTokenError';
  }
}
