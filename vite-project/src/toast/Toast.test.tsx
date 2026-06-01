import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Toast, ToastProvider } from './index';

describe('Toast', () => {
  it('renders nothing when there is no send error', () => {
    const { container } = render(
      <ToastProvider>
        <Toast />
      </ToastProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
