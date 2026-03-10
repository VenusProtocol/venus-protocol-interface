import type { Meta } from '@storybook/react';
import { ChainId, tokens } from '@venusprotocol/chains';

import { TextField } from '.';

export default {
  title: 'Components/TextField',
  component: TextField,
} as Meta<typeof TextField>;

export const Default = () => <TextField placeholder="0.0" type="number" min={0} />;

export const WithLabel = () => <TextField label="Label" placeholder="0.0" type="number" min={0} />;

export const WithDescription = () => (
  <TextField description="This is a fake description" placeholder="0.0" type="number" min={0} />
);

export const WithXsSize = () => <TextField placeholder="0.0" type="number" min={0} size="xs" />;

export const WithLeftIcon = () => (
  <TextField leftIconSrc="attention" placeholder="0.0" type="number" min={0} />
);

export const WithLeftTokenIcon = () => (
  <TextField leftIconSrc={tokens[ChainId.BSC_TESTNET][0]} placeholder="0.0" type="number" min={0} />
);

export const WithRightAdornment = () => (
  <TextField
    rightAdornment={<button type="button">Safe max</button>}
    placeholder="0.0"
    type="number"
    min={0}
  />
);

export const WithTopRightAdornment = () => (
  <TextField
    topRightAdornment={<button type="button">Max</button>}
    placeholder="0.0"
    type="number"
    min={0}
  />
);

export const WithHasError = () => (
  <TextField label="Label" placeholder="0.0" type="number" min={0} hasError />
);

export const WithMinAndMax = () => (
  <TextField label="Label" placeholder="0.0" type="number" min={0} max={100} />
);

export const Disabled = () => <TextField placeholder="0.0" type="number" min={0} disabled />;
