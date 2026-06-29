export type QueryValue = string | number | boolean | undefined | null;

export type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, QueryValue>;
};

export type HelperOptions = Omit<RequestOptions, 'method' | 'body'>;
