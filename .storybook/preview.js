import 'loki/configure-react';
import { rest } from 'msw';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import GovernanceResponse from '../src/__mocks__/api/governance.json';
import TransactionResponse from '../src/__mocks__/api/transactions.json';
import VotersReponse from '../src/__mocks__/api/voters.json';
import '../src/assets/styles/index.scss';
import { withQueryClientProvider, withThemeProvider } from '../src/stories/decorators';
import { PALETTE } from '../src/theme/MuiThemeProvider/muiTheme';

import initializeLibraries from '../src/initializeLibraries';

initialize({
  onUnhandledRequest: 'bypass',
});

initializeLibraries();

const mockRpcProviderResponse = (req, res, ctx) => {
  let response = {};

  // treasuryPercent call to vaiController contract
  if (
    req.body.params[0].data === '0x04ef9d58' &&
    req.body.params[0].to === '0xf70c3c6b749bbab89c081737334e74c9afd4be16'
  ) {
    response = {
      jsonrpc: req.body.jsonrpc,
      id: req.body.id,
      result: '0x00000000000000000000000000000000000000000000000000005af3107a4000',
    };
  }

  return res(ctx.json(response));
};

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'Paper',
    values: [
      {
        name: 'Primary',
        value: PALETTE.background.default,
      },
      {
        name: 'Paper',
        value: PALETTE.background.paper,
      },
      {
        name: 'White',
        value: 'rgba(255, 255, 255, 1)',
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
          return res(ctx.json(VotersReponse));
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
        rest.post(
          'https://speedy-nodes-nyc.moralis.io/6c1fe2e962cdccfe0e93dcb3/bsc/testnet',
          mockRpcProviderResponse,
        ),
      ],
    },
  },
};

export const decorators = [mswDecorator, withThemeProvider, withQueryClientProvider];
