export default class MissingParamError extends Error {
  constructor() {
    super('All fields must be filled');
    this.name = 'message';
  }
}
