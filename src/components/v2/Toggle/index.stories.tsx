import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withOnChangeValue } from 'stories/decorators';
import Box from '@mui/material/Box';
import { Toggle } from '.';

export default {
  title: 'Toggle',
  component: Toggle,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Toggle>;

const Template = ({ value }: { value: boolean }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
    }}
  >
    <Box sx={{ display: 'flex' }}>
      <Toggle onChange={() => {}} value={value} />
    </Box>
  </Box>
);

export const ToggleOn = Template.bind({});
// ToggleOn.args = {
//   value: true, // manually set the label.
// };

// export const ToggleOn = ({ value }: { value: boolean }) => (
//   <Box
//     sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       width: '100%',
//       height: '100vh',
//     }}
//   >
//     <Box sx={{ display: 'flex' }}>
//       <Toggle onChange={() => { }} value={value} />
//     </Box>
//   </Box>
// );

ToggleOn.decorators = [withOnChangeValue(true)];
export const ToggleOff = Template.bind({});

ToggleOff.args = {
  value: true, // manually set the label.
};

// export const ToggleOff = ({ value }: { value: boolean }) => {
//   console.log({ value });
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100vh',
//       }}
//     >
//       <Box sx={{ display: 'flex' }}>
//         <Toggle onChange={() => { }} value={value} />
//       </Box>
//     </Box>
//   );
// };

// // ToggleOff.decorators = [withOnChangeValue(false)];
