import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileEmailFormView } from '../ProfileEmailFormView';
import { ProfileEmailFormContext } from '../ProfileEmailForm.context';
import type { ProfileEmailFormValue } from '../ProfileEmailForm.types';

function renderWith(overrides: Partial<ProfileEmailFormValue> = {}) {
  const value: ProfileEmailFormValue = {
    email: 'alice@example.com',
    onEmailChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
    isSaving: false,
    submittable: true,
    error: null,
    ...overrides,
  };
  render(
    <ProfileEmailFormContext.Provider value={value}>
      <ProfileEmailFormView />
    </ProfileEmailFormContext.Provider>,
  );
  return value;
}

describe('ProfileEmailFormView', () => {
  it('shows the current email', () => {
    renderWith();
    expect(screen.getByPlaceholderText('Email')).toHaveValue('alice@example.com');
  });

  it('renders the error when present', () => {
    renderWith({ error: 'Email is already registered.' });
    expect(screen.getByText('Email is already registered.')).toBeInTheDocument();
  });

  it('disables the save button when not submittable', () => {
    renderWith({ submittable: false });
    expect(screen.getByRole('button', { name: 'Save email' })).toBeDisabled();
  });

  it('submits the form via the save button', () => {
    const value = renderWith();
    fireEvent.click(screen.getByRole('button', { name: 'Save email' }));
    expect(value.onSubmit).toHaveBeenCalledTimes(1);
  });
});
