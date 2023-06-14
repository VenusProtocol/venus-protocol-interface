import { Meta } from '@storybook/react';
import React from 'react';

import { TOKENS, VBEP_TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenIcon } from '.';

export default {
  title: 'Components/TokenIcon',
  component: TokenIcon,
  decorators: [withCenterStory({ width: '50vw' })],
} as Meta<typeof TokenIcon>;

export const Default = () => (
  <>
    <h2 style={{ marginBottom: '12px' }}>Common tokens (testnet)</h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px 24px',
        marginBottom: '32px',
      }}
    >
      {Object.values(TOKENS).map(token => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h4 style={{ marginRight: '8px' }}>{token.symbol}</h4>

          <TokenIcon token={token} />
        </div>
      ))}
    </div>

    <h2 style={{ marginBottom: '12px' }}>VBep20 tokens (testnet)</h2>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px' }}>
      {Object.values(VBEP_TOKENS).map(vToken => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h4 style={{ marginRight: '8px' }}>{vToken.symbol}</h4>

          <TokenIcon token={vToken.underlyingToken} />
        </div>
      ))}
    </div>
  </>
);
