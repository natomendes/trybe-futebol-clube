export default class MissingParamError extends Error {
  constructor(param = 'All fields must be filled') {
    super(param);
    this.name = 'Missing Param';
  }
}
