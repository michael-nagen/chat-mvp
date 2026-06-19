// Default avatar assigned to every newly created user. It is an inline SVG data
// URI stored directly on the user document in Mongo (NOT an S3 object), so it is
// trivially served with the user — no extra fetch, no storage round-trip. Since
// it has no S3 object, the user's avatarKey stays null and the replace/remove
// flow simply overwrites/clears this value.
export const DEFAULT_AVATAR_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIzMiIgZmlsbD0iI2U4ZjBmZSIvPjxjaXJjbGUgY3g9IjMyIiBjeT0iMjYiIHI9IjEzIiBmaWxsPSIjMDA4NGZmIi8+PHBhdGggZD0iTTExIDU3YTIxIDIxIDAgMCAxIDQyIDB6IiBmaWxsPSIjMDA4NGZmIi8+PC9zdmc+Cg==';
