import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileAvatarView } from '../ProfileAvatarView';
import { ProfileAvatarContext } from '../ProfileAvatar.context';
import type { ProfileAvatarValue } from '../ProfileAvatar.types';

function renderWith(overrides: Partial<ProfileAvatarValue> = {}) {
  const value: ProfileAvatarValue = {
    avatarUrl: null,
    displayName: 'Alice Anderson',
    hasAvatar: false,
    isBusy: false,
    error: null,
    fileInputRef: { current: null },
    onSelectFile: vi.fn(),
    onRemove: vi.fn(),
    ...overrides,
  };
  render(
    <ProfileAvatarContext.Provider value={value}>
      <ProfileAvatarView />
    </ProfileAvatarContext.Provider>,
  );
  return value;
}

describe('ProfileAvatarView', () => {
  it('shows the upload button', () => {
    renderWith();
    expect(screen.getByRole('button', { name: 'Upload new photo' })).toBeInTheDocument();
  });

  it('hides the remove button when there is no avatar', () => {
    renderWith({ hasAvatar: false });
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('shows the remove button and removes on click when an avatar is set', () => {
    const value = renderWith({ hasAvatar: true });
    const remove = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(remove);
    expect(value.onRemove).toHaveBeenCalledTimes(1);
  });

  it('shows a working label while busy', () => {
    renderWith({ isBusy: true });
    expect(screen.getByRole('button', { name: 'Working...' })).toBeInTheDocument();
  });

  it('renders the error when present', () => {
    renderWith({ error: 'Could not update avatar.' });
    expect(screen.getByText('Could not update avatar.')).toBeInTheDocument();
  });
});
