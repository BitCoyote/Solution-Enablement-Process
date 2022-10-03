import React from 'react';
import { getByLabelText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseProgress from './PhaseProgress';
import { TaskExtended } from '../../../shared/types/Task';

const phase = [{ i: '1' }, { i: '2' }, { i: '3' }, { i: '4' }] as any as TaskExtended[];
const task = [{ i: '1' }] as unknown as TaskExtended[];
const tasks3 = phase.slice(0, 3)

describe('Sep overview header component', () => {
  it('should show the progress bar at 0 progress', async () => {
    const { getByRole, getByLabelText } = render(
      <PhaseProgress
        title="Testing Phase Progress bar"
        phase={phase}
        tasks={[]}
      />
    );

    screen.debug()
    const progressBar = getByRole('progressbar');
    const unstartedCircleIcon = getByLabelText('unstarted-circle')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
    expect(unstartedCircleIcon).toBeInTheDocument()
  });
  it('should show the progress bar at 25 progress', async () => {
    const { getByRole } = await render(
      <PhaseProgress
        title="Testing Phase Progress bar"
        phase={phase}
        tasks={task}
      />
    );

    const progressBar = getByRole('progressbar');
    //screen.debug(progressBar)
    expect(progressBar.getAttribute('aria-valuenow')).toBe('25');
  });
  it('should show the progress bar filled to 75, last icon on the progress bar gray since one of three phases is incomplete', () => {

    const { getByRole, getByLabelText } = render(
      <PhaseProgress
        title="Implement Phase"
        phase={phase}
        tasks={tasks3}
      />
    );

    const progressBar = getByRole('progressbar');
    const progressBarComponent = getByLabelText('started-circle')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('75');
    expect(progressBarComponent).toBeInTheDocument();
  });

  it('should show the progress bar filled to 100, last icon would be green since all phases are completed', () => {
    const { getByRole ,getByLabelText} = render(
      <PhaseProgress
        title="Implement Phase"
        phase={phase}
        tasks={phase}
        sepFinish={true}
      />
    );

    const progressBar = getByRole('progressbar');
    const finishIconSelector = getByLabelText('finish-progress')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('100');
    expect(finishIconSelector).toHaveClass('fa-badge-check')
  });


});
