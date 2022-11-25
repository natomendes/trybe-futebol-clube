export type LoginReq = {
  email?: string,
  password?: string,
};

export type AuthHeader = {
  authorization?: string
};

export interface HttpRequest {
  headers?: AuthHeader
  body?: LoginReq
}
export interface HttpResponse {
  statusCode: number
  body?: unknown
}
