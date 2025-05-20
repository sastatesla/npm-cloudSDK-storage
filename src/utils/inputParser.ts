import {
  fileUploadOptionsSchema,
  cloudStorageConfigSchema,
} from "../validations/schemaValidation";
import { FileUploadOptions } from "../types";
import { StorageError } from "../utils/error";

export function parseFileUploadOptions(input: any): FileUploadOptions {
  const { value, error } = fileUploadOptionsSchema.validate(input || {});
  if (error) throw new StorageError(`Invalid file upload options: ${error.message}`);
  return value;
}

export function parseCloudStorageConfig(input: any) {
  const { value, error } = cloudStorageConfigSchema.validate(input || {});
  if (error) throw new StorageError(`Invalid storage config: ${error.message}`);
  return value;
}