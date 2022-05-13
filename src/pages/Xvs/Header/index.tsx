/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';

interface IHeaderProps {
  className?: string;
}

const HeaderUi: React.FC<IHeaderProps> = ({ className }) => <Paper className={className} />;

const Header: React.FC<IHeaderProps> = ({ className }) => <HeaderUi className={className} />;

export default Header;
