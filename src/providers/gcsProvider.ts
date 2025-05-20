import {Storage} from "@google-cloud/storage"
import {StorageProvider} from "./storageProvider"
import {
	FileUploadOptions,
	FileInfo,
	GCSConfig,
	CloudStorageConfig,
	BufferFileInfo
} from "../types/index"
import {StorageError} from "../utils/error"
import mimeLookup from "../helpers/helpers"
import path from "path"
import {parseFileUploadOptions} from "../utils/inputParser"
import crypto from "crypto"

export class GCSProvider extends StorageProvider {
	public async uploadBulkBuffer(
		files: BufferFileInfo[],
		options?: FileUploadOptions
	): Promise<FileInfo[]> {
		return Promise.all(
			files.map((file) => this.uploadBuffer(file, options))
		)
	}
	private storage: Storage
	private bucketName: string
	private allowedFileTypes?: string[]

	constructor(
		private readonly gcsConfig: GCSConfig,
		private readonly cloudStorageConfig: CloudStorageConfig
	) {
		super()
		this.bucketName = gcsConfig.bucketName
		this.allowedFileTypes = cloudStorageConfig.allowedFileTypes
		this.storage = new Storage({credentials: gcsConfig.credentials})
	}

	// Upload a file from a file path (for existing files on disk)
	public async upload(
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		const parsedOptions = parseFileUploadOptions(options)

		try {
			if (this.allowedFileTypes) {
				const mimeType = mimeLookup(filePath)
				if (!mimeType || !this.allowedFileTypes.includes(mimeType)) {
					throw new StorageError(`Invalid file type: ${mimeType}`)
				}
			}
			const destination = options?.destination || path.basename(filePath)
			const [file] = await this.storage
				.bucket(this.bucketName)
				.upload(filePath, {
					destination,
					metadata: options?.metadata
				})
			return {
				id: file.name,
				url: `https://storage.googleapis.com/${this.bucketName}/${file.name}`,
				provider: "gcs",
				metadata: file.metadata
			}
		} catch (err: any) {
			throw new StorageError(
				`GCS upload failed: ${err.message}`,
				"GCS_UPLOAD_ERROR",
				err
			)
		}
	}

	// NEW: Upload a file buffer (e.g., from multer memory storage)
	public async uploadBuffer(
		file: BufferFileInfo,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		try {
			if (
				this.allowedFileTypes &&
				(!file.mimetype ||
					!this.allowedFileTypes.includes(file.mimetype))
			) {
				throw new StorageError(`Invalid file type: ${file.mimetype}`)
			}
			const extension = path.extname(file.originalname)
			const randomName =
				crypto.randomBytes(16).toString("hex") + extension
			const destination = options?.destination || randomName
			const bucketFile = this.storage
				.bucket(this.bucketName)
				.file(destination)

			await new Promise<void>((resolve, reject) => {
				const stream = bucketFile.createWriteStream({
					resumable: false,
					contentType: file.mimetype,
					metadata: options?.metadata
				})

				stream.on("error", reject)
				stream.on("finish", resolve)

				stream.end(file.buffer)
			})

			return {
				id: bucketFile.name,
				url: `https://storage.googleapis.com/${this.bucketName}/${bucketFile.name}`,
				provider: "gcs",
				metadata: (await bucketFile.getMetadata())[0]
			}
		} catch (err: any) {
			throw new StorageError(
				`GCS uploadBuffer failed: ${err.message}`,
				"GCS_UPLOAD_BUFFER_ERROR",
				err
			)
		}
	}

	public async uploadBulk(
		filePaths: string[],
		options?: FileUploadOptions
	): Promise<FileInfo[]> {
		return Promise.all(
			filePaths.map((filePath) => this.upload(filePath, options))
		)
	}

	public async delete(fileId: string): Promise<void> {
		try {
			await this.storage.bucket(this.bucketName).file(fileId).delete()
		} catch (err: any) {
			throw new StorageError(
				`GCS delete failed: ${err.message}`,
				"GCS_DELETE_ERROR",
				err
			)
		}
	}

	public async deleteBulk(fileIds: string[]): Promise<void[]> {
		return Promise.all(fileIds.map((id) => this.delete(id)))
	}

	public async createFolder(folderName: string): Promise<void> {
		try {
			await this.storage
				.bucket(this.bucketName)
				.file(`${folderName.replace(/\/$/, "")}/.placeholder`)
				.save("")
		} catch (err: any) {
			throw new StorageError(
				`GCS createFolder failed: ${err.message}`,
				"GCS_CREATEFOLDER_ERROR",
				err
			)
		}
	}

	public async uploadToFolder(
		folderName: string,
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		const fileName = path.basename(options?.destination ?? filePath)
		const destination = `${folderName.replace(/\/$/, "")}/${fileName}`
		return this.upload(filePath, {...options, destination})
	}

	public async uploadBufferToFolder(
		folderName: string,
		file: {buffer: Buffer; originalname: string; mimetype: string},
		options?: FileUploadOptions
	): Promise<FileInfo> {
		const fileName = options?.destination ?? file.originalname
		const destination = `${folderName.replace(/\/$/, "")}/${fileName}`
		return this.uploadBuffer(file, {...options, destination})
	}
}
