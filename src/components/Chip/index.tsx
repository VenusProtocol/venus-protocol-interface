/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalType } from 'types';

import { Icon } from '../Icon';
import { useStyles } from './styles';
import { ChipProps, ProposalTypeChipProps } from './types';

export * from './types';

export const Chip = ({ className, text, iconName, type = 'default' }: ChipProps) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.root({ chipType: type })}>
      {!!iconName && <Icon name={iconName} css={styles.icon} />}

      <Typography variant="small2" color="textPrimary">
        {text}
      </Typography>
    </div>
  );
};

export const ActiveChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="active" />;

export const InactiveChip: React.FC<ChipProps> = ({ ...props }) => (
  <Chip {...props} type="inactive" />
);

export const BlueChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="blue" />;

export const ErrorChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="error" />;

export const ProposalTypeChip: React.FC<ProposalTypeChipProps> = ({ proposalType, ...props }) => {
  const { t } = useTranslation();

  const chipProps: Pick<ChipProps, 'text' | 'iconName'> = useMemo(
    () =>
      proposalType === ProposalType.FAST_TRACK
        ? {
            text: t('chip.proposalType.fastTrack'),
            iconName: 'lightening',
          }
        : {
            text: t('chip.proposalType.critical'),
            iconName: 'fire',
          },
    [proposalType, t],
  );

  return <Chip {...chipProps} {...props} />;
};
