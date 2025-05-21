export type FileUploadOptions = {
	destination?: string
	metadata?: Record<string, any>
}

export type FileInfo = {
	id: String
	url: String
	provider: String
	metadata?: any
}

export type BufferFileInfo = {
	buffer: Buffer
	originalname: string
	mimetype: string
}

type SupportedProviders = "gcs" | "s3" | "do-spaces" | "cloudinary"

export type CloudStorageConfig = {
	provider: SupportedProviders
	config: any
	allowedFileTypes?: string[]
}

export type GCSConfig = {
	bucketName: string
	credentials: object
}

export type S3Config = {
	region: string
	accessKeyId: string
	secretAccessKey: string
	bucketName: string
}

export type DOSpacesConfig = {
	region: string
	endpoint: string
	accessKeyId: string
	secretAccessKey: string
	bucketName: string
}
