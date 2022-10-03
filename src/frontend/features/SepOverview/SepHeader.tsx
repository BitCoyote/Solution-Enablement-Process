import React from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import './styles.css';
import PhaseProgress from './PhaseProgress';

const SepHeader = ({ sep }: any) => {
  const theme = useTheme();
  const groupByPhase = groupBy(sep.tasks, 'phase');
  const initiatePhase = groupBy(groupByPhase.initiate, 'status');
  const designPhase = groupBy(groupByPhase.design, 'status');
  const implementPhase = groupBy(groupByPhase.implement, 'status');

  function groupBy(objectArray: [], property: string) {
    return objectArray.reduce((acc: any, obj: any) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }

  const sepFinish = sep.phase === 'complete';

  return (
    <>
      <Box sx={{ padding: '30px 30px 10px 30px' }}>
        <Box display="flex">
          <Box>
            <Typography
              sx={{
                font: ' normal normal 600 25px/34px Open Sans;',
              }}
            >
              {sep?.name}
            </Typography>
            <Typography
              sx={{
                font: 'normal normal normal 18px/24px Open Sans;',
                color: '#7E8083',
                mt: 1,
              }}
            >
              {`SEP ${sep?.id}`}
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <Box
            sx={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="text"
              sx={{
                textTransform: 'none',
                font: 'normal normal 600 12px/17px Open Sans;',
              }}
            >
              View SEP Details
            </Button>
            <Typography
              sx={{
                font: 'normal normal normal 10px/22px Open Sans;',
                color: '#646669;',
              }}
            >
              {sep?.updatedAt &&
                `Last Saved: ${format(
                  parseISO(sep?.updatedAt as string),
                  'Pp'
                )}`}
            </Typography>
          </Box>
        </Box>
        <br />
        <Grid container spacing={0}>
          <Grid item md={6}>
            <Grid container spacing={0}>
              <Grid item md={3}>
                <p className="sep-label">Requestor</p>
                <p className="sep-data">
                  {sep?.creator?.displayName}&nbsp;&nbsp;
                  <a href={`mailto:${sep.creator.email}`}>
                    <i
                      className="fa-solid fa-envelope"
                      style={{ color: '#7E8083' }}
                    />
                  </a>
                </p>
              </Grid>
              <Grid item md={3}>
                <p className="sep-label">Request Date</p>
                <p className="sep-data">
                  {format(parseISO(sep?.createdAt), 'P')}
                </p>
              </Grid>
              <Grid item md={3}>
                <p className="sep-label">
                  {' '}
                  Data Classification &nbsp;&nbsp;
                  <i
                    className="fa-solid fa-shield-halved"
                    style={{ color: theme.palette.solidBlue.main }}
                  ></i>
                </p>
                <p className="sep-data">{'<Data Classification>'}</p>
              </Grid>
              <Grid item md={3}>
                <p className="sep-label">Status</p>
                <p className="sep-data">{sep.phase}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Grid container>
              <Grid item md={12}>
                <p className="sep-label">My Request Progress</p>
              </Grid>
              <Grid item md={4}>
                <PhaseProgress
                  title="Initiate Phase"
                  phase={groupByPhase.initiate}
                  tasks={initiatePhase}
                />
              </Grid>
              <Grid item md={4}>
                <PhaseProgress
                  title="Design Phase"
                  phase={groupByPhase.design}
                  tasks={designPhase}
                />
              </Grid>
              <Grid item md={4}>
                <PhaseProgress
                  title="Implement Phase"
                  phase={groupByPhase.implement}
                  tasks={implementPhase}
                  sepFinish={sepFinish}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </>
  );
};

export default SepHeader;
