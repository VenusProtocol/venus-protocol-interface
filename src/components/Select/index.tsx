/** @jsxImportSource @emotion/react */
import { Select as MuiSelect } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'translation';

import { useIsSmDown } from 'hooks/responsive';

import { TextButton } from '../Button';
import { Icon } from '../Icon';
import { SELECTED_MENU_ITEM_CLASSNAME, useStyles } from './styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string | number | undefined;
  onChange: (e: SelectChangeEvent<string | number | undefined>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  ariaLabel: string;
  className?: string;
  label?: string;
  placeLabelToLeft?: boolean;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  className,
  options,
  value,
  onChange,
  onBlur,
  ariaLabel,
  label,
  placeLabelToLeft = false,
  name,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const styles = useStyles();
  const isSmDown = useIsSmDown();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const menuProps = useMemo(() => {
    const mobileStyles: Partial<MenuProps> = {
      transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      anchorReference: 'none',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    };
    return {
      PaperProps: {
        sx: styles.menuWrapper,
      },
      ...(isSmDown ? mobileStyles : {}),
    };
  }, [isSmDown]);

  return (
    <div className={className} css={styles.getContainer({ placeLabelToLeft })}>
      {!!label && (
        <div css={styles.getLabel({ placeLabelToLeft })}>
          <Typography variant="small1" component="label" htmlFor="proposalType">
            {label || t('select.defaultLabel')}
          </Typography>
        </div>
      )}

      <MuiSelect<string | number | undefined>
        name={name}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        css={styles.select({ isOpen })}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        inputProps={{ 'aria-label': ariaLabel }}
        IconComponent={() => (
          <Icon css={styles.getArrowIcon({ isMenuOpened: isOpen })} name="arrowUp" />
        )}
        MenuProps={menuProps}
        autoWidth={isSmDown}
      >
        <div css={styles.mobileHeader}>
          <Typography variant="h4">{label || t('select.defaultLabel')}</Typography>

          <TextButton css={styles.closeMenuButton} onClick={handleClose}>
            <Icon name="closeRounded" />
          </TextButton>
        </div>

        {options.map(({ value: v, label: optionLabel }) => (
          <MenuItem
            disableRipple
            css={styles.menuItem}
            key={v}
            classes={{ selected: SELECTED_MENU_ITEM_CLASSNAME }}
            value={v}
          >
            {optionLabel}
          </MenuItem>
        ))}
      </MuiSelect>
    </div>
  );
};
