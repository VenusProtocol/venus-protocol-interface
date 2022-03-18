import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  const Container = css`
    height: 56px;
    padding: 0 ${theme.spacing(2)};
    background-color: var(--color-bg-main);
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @media only screen and (max-width: 768px) {
      height: auto;
      padding: ${theme.spacing(3)} ${theme.spacing(2)};
      flex-direction: column;
    }
  `;

  const Status = css`
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      margin-bottom: ${theme.spacing(2)};
    }
  `;

  const StatusBlockNumber = css`
    color: ${theme.palette.text.primary};
  `;

  const Links = css`
    display: flex;
    align-items: center;
    margin-left: ${theme.spacing(1)};

    @media only screen and (max-width: 768px) {
      margin-left: 0;
    }
  `;

  const Link = css`
    background-color: ${theme.palette.secondary.light};
    transition: background-color 0.3s;
    margin-left: ${theme.spacing(2)};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;

    :hover {
      background-color: ${theme.palette.button.main};
    }

    :active {
      background-color: ${theme.palette.button.dark};
    }
  `;

  return {
    Container,
    Status,
    StatusBlockNumber,
    Links,
    Link,
    theme,
  };
};
