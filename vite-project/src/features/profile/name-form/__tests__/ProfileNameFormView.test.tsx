import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileNameFormView } from '../ProfileNameFormView';
import { ProfileNameFormContext } from '../ProfileNameForm.context';
import type { ProfileNameFormValue } from '../ProfileNameForm.types';

function renderWith(overrides: Partial<ProfileNameFormValue> = {}) {
  const value: ProfileNameFormValue = {
    firstName: 'Alice',
    lastName: 'Anderson',
    onFirstNameChange: vi.fn(),
    onLastNameChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
    isSaving: false,
    submittable: true,
    error: null,
    ...overrides,
  };
  render(
    <ProfileNameFormContext.Provider value={value}>
      <ProfileNameFormView />
    </ProfileNameFormContext.Provider>,
  );
  return value;
}

describe('ProfileNameFormView', () => {
  it('shows the current first and last name', () => {
    renderWith();
    expect(screen.getByPlaceholderText('First name')).toHaveValue('Alice');
    expect(screen.getByPlaceholderText('Last name')).toHaveValue('Anderson');
  });

  it('renders the error when present', () => {
    renderWith({ error: 'Could not update name.' });
    expect(screen.getByText('Could not update name.')).toBeInTheDocument();
  });

  it('disables the save button when not submittable', () => {
    renderWith({ submittable: false });
    expect(screen.getByRole('button', { name: 'Save name' })).toBeDisabled();
  });

  it('shows a saving label while saving', () => {
    renderWith({ isSaving: true });
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
  });

  it('submits the form via the save button', () => {
    const value = renderWith();
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
    expect(value.onSubmit).toHaveBeenCalledTimes(1);
  });
});
