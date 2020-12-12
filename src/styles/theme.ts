import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';

export const theme = unstable_createMuiStrictModeTheme({
  palette: {
    type: 'dark',
    primary: pink,
  },
});
