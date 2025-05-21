import {StorageProvider} from "./providers/storageProvider"
import {GCSProvider} from "./providers/gcsProvider"
import {S3Provider} from "./providers/s3Provider"
import {DOSpacesProvider} from "./providers/doSpacesProvider"
// import { CloudinaryProvider } from "../providers/CloudinaryProvider";
import {FileUploadOptions, FileInfo, CloudStorageConfig} from "./types/index"
import {parseCloudStorageConfig} from "./utils/inputParser"

export class CloudStorage {
	private providerInstance: StorageProvider

	private constructor(providerInstance: StorageProvider) {
		this.providerInstance = providerInstance
	}

	public static init(config: CloudStorageConfig): CloudStorage {
		const validatedConfig = parseCloudStorageConfig(config)

		switch (config.provider) {
			case "gcs":
				// @ts-ignore
				return new CloudStorage(
					new GCSProvider(config.config, config.allowedFileTypes)
				)
			case "s3":
				// @ts-ignore
				return new CloudStorage(
					new S3Provider(config.config, config.allowedFileTypes)
				)

			case "do-spaces":
				// @ts-ignore
				return new CloudStorage(
					new DOSpacesProvider(config.config, config.allowedFileTypes)
				)
			// case "cloudinary":
			//   return new CloudStorage(new CloudinaryProvider(config.config));
			default:
				throw new Error("Unsupported provider")
		}
	}

	public upload(
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		return this.providerInstance.upload(filePath, options)
	}

	public uploadBulk(
		filePaths: string[],
		options?: FileUploadOptions
	): Promise<FileInfo[]> {
		return this.providerInstance.uploadBulk(filePaths, options)
	}

	public delete(fileId: string): Promise<void> {
		return this.providerInstance.delete(fileId)
	}

	public deleteBulk(fileIds: string[]): Promise<void[]> {
		return this.providerInstance.deleteBulk(fileIds)
	}

	public createFolder(folderName: string): Promise<void> {
		return this.providerInstance.createFolder(folderName)
	}

	public uploadToFolder(
		folderName: string,
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		return this.providerInstance.uploadToFolder(
			folderName,
			filePath,
			options
		)
	}

	// NEW: Upload a buffer (e.g., from multer memoryStorage)
	public uploadBuffer(
		file: {buffer: Buffer; originalname: string; mimetype: string},
		options?: FileUploadOptions
	): Promise<FileInfo> {
		// @ts-ignore
		return this.providerInstance.uploadBuffer(file, options)
	}

	// NEW: Bulk upload for buffers
	public uploadBulkBuffer(
		files: {buffer: Buffer; originalname: string; mimetype: string}[],
		options?: FileUploadOptions
	): Promise<FileInfo[]> {
		// @ts-ignore
		return this.providerInstance.uploadBulkBuffer(files, options)
	}

	// NEW: Upload buffer to specific folder
	public uploadBufferToFolder(
		folderName: string,
		file: {buffer: Buffer; originalname: string; mimetype: string},
		options?: FileUploadOptions
	): Promise<FileInfo> {
		// @ts-ignore
		return this.providerInstance.uploadBufferToFolder(
			folderName,
			file,
			options
		)
	}
}
