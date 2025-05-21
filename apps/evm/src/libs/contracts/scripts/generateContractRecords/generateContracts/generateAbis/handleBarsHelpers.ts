import * as Handlebars from 'handlebars';

Handlebars.registerHelper(
  'decapitalize',
  context => `${context[0].toLowerCase()}${context.substring(1)}`,
);
