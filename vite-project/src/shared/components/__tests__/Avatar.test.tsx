import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders the given image with alt text', () => {
    render(<Avatar src="https://cdn.example.com/a.png" name="Alice Anderson" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/a.png');
    expect(img).toHaveAttribute('alt', 'Alice Anderson');
  });

  it('shows the default avatar when there is no src', () => {
    render(<Avatar src={null} name="Alice Anderson" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('default-avatar');
  });

  it('shows the default avatar for an empty src', () => {
    render(<Avatar src="" name="Alice Anderson" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('default-avatar');
  });

  it('falls back to the default avatar when the image fails to load', () => {
    render(<Avatar src="https://cdn.example.com/broken.png" name="Alice Anderson" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('default-avatar');
  });
});
