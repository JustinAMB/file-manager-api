import { UserAccessGuard } from './user-access.guard';

describe('UserAccessGuard', () => {
  it('should be defined', () => {
    expect(new UserAccessGuard()).toBeDefined();
  });
});
