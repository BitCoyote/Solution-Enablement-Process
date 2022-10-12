import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils';
import '@testing-library/jest-dom';
import AttachmentUpload from './AttachmentUpload';

describe('AttachmentUpload component', () => {
  it('should check prev page button', async () => {
    const { getByLabelText } = renderWithProviders(
      <AttachmentUpload/>
    );
  });
});
