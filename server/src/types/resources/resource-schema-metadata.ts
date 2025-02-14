export type ResourceSchemaMetadata<T extends object> = {
  modelName: string;
  virtualFields?: Record<string, string>;
  fields?: Partial<Record<string, keyof T>>;
};
