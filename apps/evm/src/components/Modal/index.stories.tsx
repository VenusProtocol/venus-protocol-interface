import type { Meta, StoryFn } from '@storybook/react';

import { Modal, type ModalProps } from '.';

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta<typeof Modal>;

const Template: StoryFn<ModalProps> = (args: ModalProps) => <Modal {...args} />;
const ModalContent = () => (
  <>
    <h2 className="text-lg font-medium leading-8">Text in a modal</h2>
    <p className="mt-2">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
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

export const ModalWithoutHeader = Template.bind({});
ModalWithoutHeader.args = {
  isOpen: true,
  children: <ModalContent />,
};

export const ModalWithCustomClasses = Template.bind({});
ModalWithCustomClasses.args = {
  handleClose: console.log,
  handleBackAction: console.log,
  isOpen: true,
  children: <ModalContent />,
  title: <>Title component</>,
  backdropClassName: 'bg-dark-blue/40',
  buttonClassName: 'text-blue hover:text-blue-light',
  className: 'max-w-100 border-light-blue',
  rootClassName: 'p-4',
};

export const ModalClosed = Template.bind({});
ModalClosed.args = {
  handleClose: console.log,
  isOpen: false,
  children: <ModalContent />,
  title: <>Title component</>,
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
