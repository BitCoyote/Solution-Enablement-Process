import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { LinearProgressProps } from '@mui/material/LinearProgress';

export interface StyledLinearProgressProps extends LinearProgressProps {
  complete?: boolean;
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'complete',
})<StyledLinearProgressProps>(({ complete, theme }) => ({
  backgroundColor: theme.palette.solidGrey?.light,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.solidGrey?.light,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.solidBlue?.main,
  },
  ...(complete && {
    // the overrides added when the new prop is used
    width: '100%',
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.solidGrey?.light,
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.darkGreen?.main,
    },
  }),
}));

export default StyledLinearProgress;
