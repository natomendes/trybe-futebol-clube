export type LoginReq = {
  email?: string,
  password?: string,
};

export interface HttpRequest {
  body?: LoginReq
}
export interface HttpResponse {
  statusCode: number
  body?: unknown
}
