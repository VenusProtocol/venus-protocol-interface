import Typography from '@mui/material/Typography';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Modal, ModalProps } from '.';

export default {
  title: 'Components/Modal',
  component: Modal,
  decorators: [withCenterStory({ width: 600 }), withThemeProvider],
} as Meta<typeof Modal>;

const Template: StoryFn<ModalProps> = (args: ModalProps) => <Modal {...args} />;
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

const ModalContentScrollable = () => (
  <div style={{ height: '120vh' }}>
    <ModalContent />
  </div>
);

export const ModalDefault = Template.bind({});
ModalDefault.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContent />,
};

export const ModalWithTitle = Template.bind({});
ModalWithTitle.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContent />,
  title: <>Title component</>,
};

export const ModalWithBackButton = Template.bind({});
ModalWithBackButton.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContent />,
  title: <>Title component</>,
  handleBackAction: console.log,
};

export const ModalWithNoHorizontalPadding = Template.bind({});
ModalWithNoHorizontalPadding.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContent />,
  title: <>Title component</>,
  noHorizontalPadding: true,
};

export const ModalWithScrollAndTitle = Template.bind({});
ModalWithScrollAndTitle.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContentScrollable />,
  title: <>Title component</>,
};

export const ModalWithScroll = Template.bind({});
ModalWithScroll.args = {
  handleClose: console.log,
  isOpen: true,
  children: <ModalContentScrollable />,
};
