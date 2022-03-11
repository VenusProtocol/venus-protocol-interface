import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';
import 'loki/configure-react';
import 'antd/dist/antd.css';
import '../src/assets/styles/index.scss';
import { PALETTE } from '../src/theme/MuiThemeProvider/muiTheme';
import { withThemeProvider } from '../src/stories/decorators';
import GovernanceResponse from '../src/__mocks__/api/governance.json';
import VoteReponse from '../src/__mocks__/api/vote.json';
import TransactionResponse from '../src/__mocks__/api/transactions.json';

initialize({
  onUnhandledRequest: 'bypass',
});

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'Asphalt grey',
    values: [
      {
        name: 'Asphalt grey',
        value: PALETTE.background.asphaltGrey,
      },
      {
        name: 'Black',
        value: PALETTE.background.black,
      },
      {
        name: 'Off white',
        value: PALETTE.background.offWhite,
      },
    ],
  },
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
        rest.get('https://testnetapi.venus.io/api/transactions?page=1', (req, res, ctx) => {
          return res(ctx.json(TransactionResponse));
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
