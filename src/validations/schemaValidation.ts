import Joi from "joi";

// File upload options schema
export const fileUploadOptionsSchema = Joi.object({
  destination: Joi.string().optional(),
  metadata: Joi.object().optional(),
});

// Allowed file types array
export const allowedFileTypesSchema = Joi.array().items(Joi.string().pattern(/^[-\w.]+\/[-\w.]+$/));

// GCS config schema
export const gcsConfigSchema = Joi.object({
  bucketName: Joi.string().required(),
  credentials: Joi.object().required(),
});

// S3 config schema
export const s3ConfigSchema = Joi.object({
  region: Joi.string().required(),
  bucketName: Joi.string().required(),
  accessKeyId: Joi.string().required(),
  secretAccessKey: Joi.string().required(),
});

// Main CloudStorage config
export const cloudStorageConfigSchema = Joi.object({
  provider: Joi.string().valid("gcs", "s3", "cloudinary").required(),
  config: Joi.alternatives().try(gcsConfigSchema, s3ConfigSchema).required(),
  allowedFileTypes: allowedFileTypesSchema.optional(),
});