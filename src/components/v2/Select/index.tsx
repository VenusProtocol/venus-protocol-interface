/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { Select as MuiSelect } from '@mui/material';
import { Icon } from '../Icon';
import { SELECTED_MENU_ITEM_CLASSNAME, useStyles } from './styles';

type Option = {
  value: string;
  label: string;
};

interface ISelectProps {
  className?: string;
  options: Option[];
}

const DEFAULT_OPTION = {
  value: '',
  label: 'All',
};

export const Select = ({ className, options }: ISelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState(DEFAULT_OPTION.value);
  const [isOpened, setIsOpened] = useState(false);
  const styles = useStyles();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <FormControl fullWidth hiddenLabel>
      <MuiSelect
        open={isOpened}
        onClose={handleClose}
        onOpen={handleOpen}
        className={className}
        css={styles.root}
        value={selectedValue}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Select' }}
        IconComponent={() => (
          <Icon css={styles.getArrowIcon({ isMenuOpened: isOpened })} name="arrowDown" />
        )}
        MenuProps={{
          PaperProps: {
            style: styles.menuWrapper,
          },
        }}
      >
        {[DEFAULT_OPTION, ...options].map(({ value, label }) => (
          <MenuItem
            disableRipple
            css={styles.menuItem}
            key={value}
            classes={{ selected: SELECTED_MENU_ITEM_CLASSNAME }}
            value={value}
          >
            {label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};
