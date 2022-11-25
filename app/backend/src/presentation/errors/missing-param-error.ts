export default class MissingParamError extends Error {
  constructor(param?: string) {
    if (param) {
      super(`Missing param "${param}"`);
    } else {
      super('All fields must be filled');
    }
    this.name = 'Missing Param';
  }
}
