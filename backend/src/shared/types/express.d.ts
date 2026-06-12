// Augments Express's res.locals with the authenticated user id set by requireAuth.
declare global {
  namespace Express {
    interface Locals {
      userId?: string;
    }
  }
}

export {};
