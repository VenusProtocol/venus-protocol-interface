import type { Meta } from '@storybook/react';

import tokens from '__mocks__/models/tokens';

import { TokenIcon } from '.';

export default {
  title: 'Components/TokenIcon',
  component: TokenIcon,
} as Meta<typeof TokenIcon>;

export const Default = () => (
  <>
    <h2 style={{ marginBottom: '12px' }}>Common token examples</h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px 24px',
        marginBottom: '32px',
      }}
    >
      {tokens.map(token => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h4 style={{ marginRight: '8px' }}>{token.symbol}</h4>

          <TokenIcon token={token} displayChain />
        </div>
      ))}
    </div>
  </>
);
