export type User = {
  id: string;
  name: string;
};

export type LoginResult = {
  token: string;
  user: User;
};
