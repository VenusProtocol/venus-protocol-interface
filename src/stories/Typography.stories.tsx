/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import MUITypography from '@mui/material/Typography';

const Typography: React.FC = () => (
  <>
    <MUITypography variant="h1" style={{ marginBottom: '24px' }}>
      H1 title
    </MUITypography>

    <MUITypography variant="h2" style={{ marginBottom: '24px' }}>
      H2 title
    </MUITypography>

    <MUITypography variant="h3" style={{ marginBottom: '24px' }}>
      H3 title
    </MUITypography>

    <MUITypography variant="h4" style={{ marginBottom: '24px' }}>
      H4 title
    </MUITypography>

    <MUITypography variant="body1" style={{ marginBottom: '24px' }}>
      Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac dapibus nulla,
      sed consectetur turpis. Donec ultricies purus est, at pulvinar magna consequat eu.
    </MUITypography>

    <MUITypography variant="body2" style={{ marginBottom: '24px' }}>
      Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac dapibus nulla,
      sed consectetur turpis. Donec ultricies purus est, at pulvinar magna consequat eu.
    </MUITypography>

    <MUITypography variant="small1" style={{ marginBottom: '24px', display: 'block' }}>
      Small 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac dapibus nulla,
      sed consectetur turpis. Donec ultricies purus est, at pulvinar magna consequat eu.
    </MUITypography>

    <MUITypography variant="small2" style={{ marginBottom: '24px', display: 'block' }}>
      Small 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac dapibus nulla,
      sed consectetur turpis. Donec ultricies purus est, at pulvinar magna consequat eu.
    </MUITypography>

    <a href="https://google.com">External link</a>
  </>
);

export default {
  title: 'Typography',
  component: Typography,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Typography>;

export { Typography };
