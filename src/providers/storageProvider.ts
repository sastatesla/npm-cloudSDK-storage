import {FileUploadOptions, FileInfo} from "../types"

export abstract class StorageProvider {
	public abstract upload(
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo>
	public abstract uploadBulk(
		filePaths: string[],
		options?: FileUploadOptions
	): Promise<FileInfo[]>
	public abstract delete(fileId: string): Promise<void>
	public abstract deleteBulk(fileIds: string[]): Promise<void[]>
	public abstract createFolder(folderName: string): Promise<void>
	public abstract uploadToFolder(
		folderName: string,
		filePath: string,
		options?: FileUploadOptions
	): Promise<FileInfo>

	// New: Upload a buffer (e.g., from multer memoryStorage)
	public abstract uploadBuffer(
		file: {buffer: Buffer; originalname: string; mimetype: string},
		options?: FileUploadOptions
	): Promise<FileInfo>

	// New: Bulk upload for buffers
	public abstract uploadBulkBuffer(
		files: {buffer: Buffer; originalname: string; mimetype: string}[],
		options?: FileUploadOptions
	): Promise<FileInfo[]>

	// New: Upload buffer to specific folder
	public abstract uploadBufferToFolder(
		folderName: string,
		file: {buffer: Buffer; originalname: string; mimetype: string},
		options?: FileUploadOptions
	): Promise<FileInfo>
}
