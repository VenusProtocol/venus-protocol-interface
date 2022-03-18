/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { uid } from 'react-uid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Icon } from '../Icon';
import { SELECTED_MENU_ITEM_CLASSNAME, useStyles } from './styles';

interface Option {
  value: string;
  label: string;
  img?: string;
}

interface ISelectProps {
  options: Option[];
  defaultValue: Option;
  onSelect?: (value?: string) => void;
}

export const Dropdown = ({ options, defaultValue, onSelect }: ISelectProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue.value);
  const [isOpened, setIsOpened] = useState(false);
  const styles = useStyles({ isOpened });

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setSelectedValue(newValue);
    if (onSelect) onSelect(newValue);
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <FormControl fullWidth hiddenLabel>
      <Select
        value={selectedValue}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label', disableUnderline: true }}
        IconComponent={() => <Icon name="arrowDown" />}
        MenuProps={{
          autoFocus: false,
          PaperProps: {
            style: styles.menuPaper,
          },
          MenuListProps: {
            style: styles.menuList,
          },
        }}
        open={isOpened}
        onClose={handleClose}
        onOpen={handleOpen}
        css={styles.select}
      >
        {options.map(({ value, label, img }) => (
          <MenuItem
            key={uid(value)}
            classes={{ selected: SELECTED_MENU_ITEM_CLASSNAME }}
            sx={styles.menuItem}
            value={value}
          >
            {img && <img style={styles.asset} src={img} alt={value} />}
            <Typography display="inline">{label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
