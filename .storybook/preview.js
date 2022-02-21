import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';
import 'loki/configure-react';
import 'antd/dist/antd.css';
import '../src/assets/styles/index.scss';
import { withThemeProvider } from '../src/stories/decorators';
import GovernanceResponse from '../src/__mocks__/api/governance.json';
import VoteReponse from '../src/__mocks__/api/vote.json';

initialize({
  onUnhandledRequest: 'bypass',
});

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: {
      testnet: [
        rest.post('http://localhost:8545/', (req, res, ctx) => {
          return res(ctx.json({}));
        }),
        rest.get('https://testnetapi.venus.io/api/governance/venus', (req, res, ctx) => {
          return res(ctx.json(GovernanceResponse));
        }),
        rest.get('https://testnetapi.venus.io/api/proposals', (req, res, ctx) => {
          return res(ctx.json(VoteReponse));
        }),
        rest.get(
          'https://testnetapi.venus.io/api/market_history/graph?asset=0x74469281310195A04840Daf6EdF576F559a3dE80&type=1hr&limit=168',
          (req, res, ctx) => {
            return res(
              ctx.json({
                data: { result: [] },
              }),
            );
          },
        ),
        rest.post('https://data-seed-prebsc-2-s1.binance.org:8545/', (req, res, ctx) => {
          return res(ctx.json({}));
        }),
      ],
    },
  },
};

export const decorators = [mswDecorator, withThemeProvider];
