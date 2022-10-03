import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as Circle } from '../../assets/svg/alerts.svg';
import { ReactComponent as StartCircle } from '../../assets/svg/alerts-grey.svg';
import StyledLinearProgress from '../../components/LinearProgress';
import { TaskExtended } from '../../../shared/types/Task';

type progress = {
  title: string;
  //phaseTask
  phase: TaskExtended[];
  //completedTask
  tasks: TaskExtended[];
  sepFinish?: boolean;
};

const PhaseProgress = ({ phase, tasks, title, sepFinish }: progress) => {
  const status = tasks?.length === phase.length ? true : false;
  const unStarted =
    tasks?.length === 0 || tasks?.length === undefined;
  const theme = useTheme();

  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '16px',
          marginBottom: '5px',
          width: '97.8%',
        }}
      >
        {status ? (
          <i className="fa-solid fa-badge-check" style={{ color: 'green' }} />
        ) : unStarted ? (
          <StartCircle />
        ) : (
          <Circle />
        )}
        &nbsp;
        <StyledLinearProgress
          variant="determinate"
          complete={status}
          theme={theme}
          value={
            tasks?.length !== undefined
              ? (tasks?.length / phase.length) * 100
              : 0
          }
          sx={{ m: -0.4 }}
        />
        {title === 'Implement Phase' &&
          // sep.phase === complete
          (sepFinish ? (
            <>
              &nbsp;
              <i
                className="fa-solid fa-badge-check"
                style={{ color: 'green' }}
              />
            </>
          ) : (
            <>
              &nbsp;
              <StartCircle aria-label="gray-circle"/>
            </>
          ))}
      </Box>

      <p className="sep-progress-label">{title}</p>
      <p className="sep-progress-num">
        {tasks?.length ?? 0}/{phase.length}{' '}
        <span className="task">Task Complete</span>
      </p>
    </>
  );
};

export default PhaseProgress;
