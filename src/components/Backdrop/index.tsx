import { ComponentProps, FC } from 'react';
import { default as MuiBackdrop } from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

type Props = ComponentProps<typeof MuiBackdrop>;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const Backdrop: FC<Props> = (props) => {
  const classes = useStyles();
  if (!props.open) {
    return null;
  }
  return <MuiBackdrop className={classes.backdrop} {...props} />;
};
