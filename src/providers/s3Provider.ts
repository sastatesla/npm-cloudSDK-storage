import {S3} from "aws-sdk"
import {StorageProvider} from "./storageProvider"
import {
	FileUploadOptions,
	FileInfo,
	CloudStorageConfig,
	S3Config
} from "../types/index"
import {StorageError} from "../utils/error"
import path from "path"
import crypto from "crypto"
import {parseFileUploadOptions} from "../utils/inputParser"
import mimeLookup from "../helpers/helpers"

export class S3Provider extends StorageProvider {
	private s3: S3
	private bucketName: string
	private allowedFileTypes?: string[]

	constructor(
		private readonly s3Config: S3Config,
		private readonly cloudStorageConfig: CloudStorageConfig
	) {
		super()
		this.bucketName = s3Config.bucketName
		this.allowedFileTypes = cloudStorageConfig.allowedFileTypes
		this.s3 = new S3({
			region: s3Config.region,
			accessKeyId: s3Config.accessKeyId,
			secretAccessKey: s3Config.secretAccessKey
		})
	}

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
			const fileContent = require("fs").readFileSync(filePath)
			const uploadParams: S3.PutObjectRequest = {
				Bucket: this.bucketName,
				Key: destination,
				Body: fileContent,
				ContentType: mimeLookup(filePath) || undefined,
				Metadata: options?.metadata
			}
			await this.s3.putObject(uploadParams).promise()
			return {
				id: destination,
				url: `https://${this.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${destination}`,
				provider: "s3"
			}
		} catch (err: any) {
			throw new StorageError(
				`S3 upload failed: ${err.message}`,
				"S3_UPLOAD_ERROR",
				err
			)
		}
	}

	public async uploadBuffer(
		file: {buffer: Buffer; originalname: string; mimetype: string},
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
			const uploadParams: S3.PutObjectRequest = {
				Bucket: this.bucketName,
				Key: destination,
				Body: file.buffer,
				ContentType: file.mimetype,
				Metadata: options?.metadata
			}
			await this.s3.putObject(uploadParams).promise()
			return {
				id: destination,
				url: `https://${this.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${destination}`,
				provider: "s3"
			}
		} catch (err: any) {
			throw new StorageError(
				`S3 uploadBuffer failed: ${err.message}`,
				"S3_UPLOAD_BUFFER_ERROR",
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

	public async uploadBulkBuffer(
		files: {buffer: Buffer; originalname: string; mimetype: string}[],
		options?: FileUploadOptions
	): Promise<FileInfo[]> {
		return Promise.all(
			files.map((file) => this.uploadBuffer(file, options))
		)
	}

	public async delete(fileId: string): Promise<void> {
		try {
			await this.s3
				.deleteObject({Bucket: this.bucketName, Key: fileId})
				.promise()
		} catch (err: any) {
			throw new StorageError(
				`S3 delete failed: ${err.message}`,
				"S3_DELETE_ERROR",
				err
			)
		}
	}

	public async deleteBulk(fileIds: string[]): Promise<void[]> {
		return Promise.all(fileIds.map((id) => this.delete(id)))
	}

	public async createFolder(folderName: string): Promise<void> {
		try {
			const folderKey = folderName.replace(/\/$/, "") + "/"
			await this.s3
				.putObject({
					Bucket: this.bucketName,
					Key: folderKey,
					Body: ""
				})
				.promise()
		} catch (err: any) {
			throw new StorageError(
				`S3 createFolder failed: ${err.message}`,
				"S3_CREATEFOLDER_ERROR",
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
