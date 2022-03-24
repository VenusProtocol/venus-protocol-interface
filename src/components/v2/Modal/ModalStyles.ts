import { useTheme } from '@mui/material';

const iconCloseSize = '35px';

export const useModalStyles = ({
  hasTitleComponent,
  noHorizontalPadding,
}: {
  hasTitleComponent: boolean;
  noHorizontalPadding?: boolean;
}) => {
  const theme = useTheme();
  return {
    box: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: 544,
      boxShadow: 24,
      padding: 0,
      borderRadius: theme.spacing(3),
      paddingTop: theme.spacing(3),
    },
    titleWrapper: {
      position: 'relative',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: hasTitleComponent ? theme.spacing(3) : 0,
      borderBottom: hasTitleComponent ? `1px solid ${theme.palette.secondary.dark}` : 0,
      marginBottom: hasTitleComponent ? theme.spacing(3) : 0,
      paddingTop: 0,
    },
    titleComponent: {
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: iconCloseSize,
      paddingLeft: iconCloseSize,
      paddingRight: iconCloseSize,
    },
    closeIcon: {
      right: theme.spacing(3),
      top: 0,
      position: 'absolute',
      height: iconCloseSize,
      width: iconCloseSize,
      minWidth: iconCloseSize,
      marginLeft: 'auto',
      padding: 0,
    },
    contentWrapper: {
      padding: theme.spacing(3),
      paddingLeft: noHorizontalPadding ? 0 : theme.spacing(3),
      paddingRight: noHorizontalPadding ? 0 : theme.spacing(3),
      paddingTop: 0,
    },
  };
};
