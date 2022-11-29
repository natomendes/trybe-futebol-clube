import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/controllers/sign-in/signin-protocols';

const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: {
      ...req.body,
      path: req.path.slice(1),
    },
  };

  const httpResponse = await controller.handle(httpRequest);
  res
    .status(httpResponse.statusCode)
    .json(httpResponse.body);
};

export default adaptRoute;
