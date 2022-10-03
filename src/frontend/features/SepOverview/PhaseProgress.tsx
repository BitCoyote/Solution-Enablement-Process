import React, { ReactElement } from 'react';
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

  const theme = useTheme();
  const status: boolean = tasks?.length === phase.length ? true : false;
  const unStarted: boolean = tasks?.length === 0 || tasks?.length === undefined;
  const progressBarValue = tasks?.length !== undefined ? (tasks?.length / phase.length) * 100 : 0

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
        <ProgressIconToggle status={status} unStarted={unStarted} />
        &nbsp;
        <StyledLinearProgress
          variant="determinate"
          complete={status}
          theme={theme}
          value={progressBarValue}
          sx={{ m: -0.4 }}
        />
        <FinishSepIconToggle title={title} sepFinish={sepFinish!} />
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


const ProgressIconToggle = ({ status, unStarted }: { status: boolean, unStarted: boolean }) => {

  if (status) {
    return <i className="fa-solid fa-badge-check" style={{ color: 'green' }} />
  } else {
    return unStarted ? (<StartCircle aria-label="unstarted-circle" />) : (<Circle aria-label="started-circle" />)
  }

}

const FinishSepIconToggle = ({ title, sepFinish }: { title: string, sepFinish: boolean }) => {

  if (title === "Implement Phase") {
    return sepFinish ? (
      <>
        &nbsp;
        <i
          className="fa-solid fa-badge-check"
          style={{ color: 'green' }}
          aria-label="finish-progress"
        />
      </>
    ) : (
      <>
        &nbsp;
        <StartCircle aria-label="unfinish-circle" />
      </>
    )
  } else {
    return <></>
  }

}