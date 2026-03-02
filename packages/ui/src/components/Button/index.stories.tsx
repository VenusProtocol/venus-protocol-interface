import type { Meta } from '@storybook/react';

import {
  Button,
  type ButtonProps,
  ButtonWrapper as ButtonWrapperComp,
  PrimaryButton,
  QuaternaryButton,
  QuinaryButton,
  SecondaryButton,
  SelectButton,
  SenaryButton,
  TertiaryButton,
  TextButton,
} from '.';

export default {
  title: 'Button',
  component: Button,
} as Meta<typeof Button>;

interface PresentationProps {
  children: (props?: Pick<ButtonProps, 'disabled' | 'active' | 'loading'>) => React.ReactNode;
}

const Presentation: React.FC<PresentationProps> = ({ children }) => (
  <>
    <h2 className="mx-0 mb-3 mt-0 font-semibold">Default</h2>
    {children()}

    <h2 className="mx-0 mb-3 mt-6 font-semibold">Active</h2>
    {children({ active: true })}

    <h2 className="mx-0 mb-3 mt-6 font-semibold">Disabled</h2>
    {children({ disabled: true })}

    <h2 className="mx-0 mb-3 mt-6 font-semibold">Loading</h2>
    {children({ loading: true })}
  </>
);

export const Primary = () => (
  <Presentation>
    {props => (
      <PrimaryButton onClick={console.log} {...props}>
        Primary
      </PrimaryButton>
    )}
  </Presentation>
);

export const Secondary = () => (
  <Presentation>
    {props => (
      <SecondaryButton onClick={console.log} {...props}>
        Secondary
      </SecondaryButton>
    )}
  </Presentation>
);

export const Tertiary = () => (
  <Presentation>
    {props => (
      <TertiaryButton onClick={console.log} {...props}>
        Tertiary
      </TertiaryButton>
    )}
  </Presentation>
);

export const Quaternary = () => (
  <Presentation>
    {props => (
      <QuaternaryButton onClick={console.log} {...props}>
        Quaternary
      </QuaternaryButton>
    )}
  </Presentation>
);

export const Quinary = () => (
  <Presentation>
    {props => (
      <QuinaryButton onClick={console.log} {...props}>
        Quinary
      </QuinaryButton>
    )}
  </Presentation>
);

export const Senary = () => (
  <Presentation>
    {props => (
      <SenaryButton onClick={console.log} {...props}>
        Senary
      </SenaryButton>
    )}
  </Presentation>
);

export const Text = () => (
  <Presentation>
    {props => (
      <TextButton onClick={console.log} {...props}>
        Text
      </TextButton>
    )}
  </Presentation>
);

export const Select = () => (
  <Presentation>
    {props => (
      <SelectButton onClick={console.log} {...props}>
        Select
      </SelectButton>
    )}
  </Presentation>
);

export const ButtonWrapper = () => (
  <Presentation>
    {props => (
      <ButtonWrapperComp onClick={console.log} variant="primary" asChild {...props}>
        <a href="https://google.com">Text</a>
      </ButtonWrapperComp>
    )}
  </Presentation>
);
