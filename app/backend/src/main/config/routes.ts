import { Express, Router } from 'express';
import fg = require('fast-glob');

export default (app: Express): void => {
  const router = Router();
  app.use('/', router);
  fg.sync('**/src/main/routes/**route.ts')
    .map(async (file) => (await import(`../../../${file}`)).default(router));
};
