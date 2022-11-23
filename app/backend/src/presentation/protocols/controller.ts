import { HttpRequest, HttpResponse } from './http';

export default interface Controller<ReqT, ResT> {
  handle(httpRequest: HttpRequest<ReqT>): Promise<HttpResponse<ResT>>
}
