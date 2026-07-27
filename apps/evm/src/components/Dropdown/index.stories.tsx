import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from 'components';
import { Dropdown } from '.';

const optionsDom = ({
  setIsDropdownOpen,
  optionClassName,
}: { setIsDropdownOpen: (v: boolean) => void; optionClassName?: string }) => (
  <div className="min-w-48 py-2">
    {['Option 1', 'Option 2', 'Option 3'].map(option => (
      <button
        type="button"
        className={
          optionClassName ?? 'block w-full cursor-pointer px-4 py-2 text-left hover:bg-lightGrey'
        }
        key={option}
        onClick={() => setIsDropdownOpen(false)}
      >
        {option}
      </button>
    ))}
  </div>
);

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    label: 'Dropdown label',
    menuTitle: 'Menu title',
    optionsDom,
    children: ({ isDropdownOpen, handleToggleDropdown }) => (
      <PrimaryButton onClick={handleToggleDropdown}>
        {isDropdownOpen ? 'Close' : 'Open'}
      </PrimaryButton>
    ),
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LabelToLeft: Story = {
  args: {
    placeLabelToLeft: true,
  },
};
