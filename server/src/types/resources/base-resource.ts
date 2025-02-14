import { ResourceSchemaMetadata } from "./resource-schema-metadata";

export interface BaseResource {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const baseResourceMetadata = {
  fields: {
    ID: "_id",
  },
} as const satisfies Omit<ResourceSchemaMetadata<BaseResource>, "modelName">;
