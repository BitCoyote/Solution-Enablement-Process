import React from 'react';
import { renderWithProviders } from '../utils/test-utils'
import '@testing-library/jest-dom'
import App from './App';

describe('App component', () => {
  it('should render react learning link', () => {
    const state = {
      counter: {
        value: 1,
        status: 'idle' as 'idle'
      }
    }
    const { getByText } = renderWithProviders(<App />, { preloadedState: state })
    expect(getByText(/learn/i)).toBeInTheDocument();
  });
});
