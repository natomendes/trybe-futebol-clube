export interface HttpRequest {
  headers?: any
  params?: any
  body?: any
  query?: any
}
export interface HttpResponse {
  statusCode: number
  body?: any
}
