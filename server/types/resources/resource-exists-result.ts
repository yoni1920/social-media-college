import { BaseResource } from "./base-resource";

export type ResourceExistsResult = Pick<BaseResource, "_id"> | null;
