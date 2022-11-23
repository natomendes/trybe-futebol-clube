import { HttpRequest, HttpResponse } from './http';

export default interface Controller<T> {
  handle(httpRequest: HttpRequest<T>): Promise<HttpResponse>
}
