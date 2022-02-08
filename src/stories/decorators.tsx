import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addDecorator } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'core/store';

type DecoratorFunction = Parameters<typeof addDecorator>[0];

export const withRouter: DecoratorFunction = Story => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
);

export const withProvider: DecoratorFunction = Story => (
  <Provider store={store}>
    <Story />
  </Provider>
);
