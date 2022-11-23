import { HttpRequest, HttpResponse } from './http';

export default interface Controller<ReqT> {
  handle(httpRequest: HttpRequest<ReqT>): Promise<HttpResponse>
}
