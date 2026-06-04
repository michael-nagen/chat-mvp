import { describe, expect, it } from 'vitest';
import { authRepository } from '../auth.repo';

describe('authRepository.findById', () => {
  it('returns the user for a known id', () => {
    expect(authRepository.findById('u1')).toEqual({ id: 'u1', name: 'Alice' });
  });

  it('returns undefined for an unknown id', () => {
    expect(authRepository.findById('nope')).toBeUndefined();
  });
});

describe('authRepository.findByName', () => {
  it('finds a user by exact name', () => {
    expect(authRepository.findByName('Bob')?.id).toBe('u2');
  });

  it('is case-insensitive and trims surrounding whitespace', () => {
    expect(authRepository.findByName('  ALICE ')?.id).toBe('u1');
  });

  it('returns undefined for an unknown name', () => {
    expect(authRepository.findByName('Carol')).toBeUndefined();
  });
});
