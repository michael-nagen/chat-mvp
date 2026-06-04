import { describe, expect, it } from 'vitest';
import { HTTP_STATUS } from '../httpStatus';

describe('HTTP_STATUS', () => {
  it('exposes the status codes the API uses', () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
  });
});
