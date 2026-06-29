import { ValidationException } from '../../common/errors/app.exception';

// Keyset cursor: (createdAt, _id). createdAt orders the thread; _id breaks ties
// when two messages share a timestamp. Encoded as an opaque base64 token so the
// frontend never depends on its internal shape.
export interface MessageCursor {
  createdAt: Date;
  id: string;
}

const SEPARATOR = '|';

export function encodeCursor({
  createdAt,
  id,
}: {
  createdAt: string;
  id: string;
}): string {
  return Buffer.from(`${createdAt}${SEPARATOR}${id}`, 'utf8').toString(
    'base64url',
  );
}

export function decodeCursor(token: string): MessageCursor {
  const decoded = Buffer.from(token, 'base64url').toString('utf8');
  const separatorIndex = decoded.indexOf(SEPARATOR);
  if (separatorIndex === -1) {
    throw new ValidationException('Invalid cursor.');
  }
  const createdAt = new Date(decoded.slice(0, separatorIndex));
  const id = decoded.slice(separatorIndex + 1);
  if (Number.isNaN(createdAt.getTime()) || !id) {
    throw new ValidationException('Invalid cursor.');
  }
  return { createdAt, id };
}
