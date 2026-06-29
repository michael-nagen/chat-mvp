import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const config = { getOrThrow: () => 'test-secret' } as unknown as ConfigService;

  it('maps the JWT payload to req.user shape', () => {
    const strategy = new JwtStrategy(config);
    expect(strategy.validate({ sub: 'u1', email: 'alice@example.com' })).toEqual({
      userId: 'u1',
      email: 'alice@example.com',
    });
  });
});
