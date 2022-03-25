import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withThemeProvider, withState } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { Modal } from '.';
import type { IModalProps } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  decorators: [withCenterStory({ width: 600 }), withThemeProvider, withState],
} as ComponentMeta<typeof Modal>;

const Template: Story<IModalProps> = (args: IModalProps) => <Modal {...args} />;
const ModalContent = () => (
  <>
    <Typography variant="h6" component="h2">
      Text in a modal
    </Typography>
    <Typography sx={{ mt: 2 }}>
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </Typography>
  </>
);

export const ModalDefault = Template.bind({});
ModalDefault.args = {
  handleClose: console.log,
  isOpened: true,
  children: <ModalContent />,
};

export const ModalWithTitle = Template.bind({});
ModalWithTitle.args = {
  handleClose: console.log,
  isOpened: true,
  children: <ModalContent />,
  title: <>Title component</>,
};

export const ModalWithNoHorizontalPadding = Template.bind({});
ModalWithNoHorizontalPadding.args = {
  handleClose: console.log,
  isOpened: true,
  children: <ModalContent />,
  title: <>Title component</>,
  noHorizontalPadding: true,
};
