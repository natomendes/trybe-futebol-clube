import validator from 'validator';
import { EmailValidator } from '../presentation/protocols/email-validator';

export default class EmailValidatorAdapter implements EmailValidator {
  private isEmailValid = false;
  isValid(email: string): boolean {
    this.isEmailValid = validator.isEmail(email);
    return this.isEmailValid;
  }
}
