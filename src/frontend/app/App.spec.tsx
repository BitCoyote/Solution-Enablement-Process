import React from 'react';
import { renderWithProviders } from '../utils/test-utils'
import '@testing-library/jest-dom'
import App from './App';

describe('App component', () => {
  it('should render react learning link', () => {
    const { getByText } = renderWithProviders(<App />)
    expect(getByText(/learn/i)).toBeInTheDocument();  
  });
});
