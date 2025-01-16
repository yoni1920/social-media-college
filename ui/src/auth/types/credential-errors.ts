export type CredentialErrors<T extends object> = Record<
  keyof T,
  {
    error: boolean;
    message: string;
  }
>;
