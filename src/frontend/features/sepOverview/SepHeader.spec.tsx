import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseProgress from './PhaseProgress';

const phase = [{ i: '1' }, { i: '2' }, { i: '3' }, { i: '4' }];

describe('Sep overview header component', () => {
  it('should show the progress bar at 0 progress', async () => {
    const { getByRole } = render(
      <PhaseProgress
        title="Testing Phase Progress bar"
        phase={[{ i: '1' }]}
        tasks={{ complete: [] }}
      />
    );

    const progressBar = getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
  });
  it('should show the progress bar at 10 progress', async () => {
    const { getByRole } = render(
      <PhaseProgress
        title="Testing Phase Progress bar"
        phase={phase}
        tasks={{ complete: [{ i: '1' }] }}
      />
    );

    const progressBar = getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('25');
  });

  it('should show the progress bar filled to 100', () => {
    render(
      <PhaseProgress
        title="Testing Phase Progress bar"
        phase={phase}
        tasks={{ complete: phase }}
      />
    );
  });
});
