export type CredentialErrors<T extends object> = Partial<
  Record<keyof T, string>
>;
