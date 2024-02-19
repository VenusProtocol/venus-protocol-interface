import { getTemplate } from '../getTemplate';

export const generateBarrelFile = getTemplate({
  filePath: `${__dirname}/barrel.hbs`,
});
