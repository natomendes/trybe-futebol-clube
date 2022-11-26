import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/controllers/sign-in/signin-protocols';

const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    headers: req.headers,
    params: req.params,
    body: req.body,
  };
  const httpResponse = await controller.handle(httpRequest);
  res
    .status(httpResponse.statusCode)
    .json(httpResponse.body);
};

export default adaptRoute;
