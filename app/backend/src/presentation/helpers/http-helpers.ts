import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    message: error.message,
  },
});

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: {
    message: error.message,
  },
});

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
});
