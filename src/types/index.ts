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
type SupportedProviders = "gcs" | "s3" | "cloudinary"

export type CloudStorageConfig = {
	provider: SupportedProviders
	config: any
	allowedFileTypes?: string[]
}

export type GCSConfig = {
	bucketName: string
	credentials: object
}
