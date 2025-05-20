import { Storage } from "@google-cloud/storage";
import { StorageProvider } from "./storageProvider";
import { FileUploadOptions, FileInfo, GCSConfig, CloudStorageConfig } from "../types/index";
import { StorageError } from "../utils/error";
import mimeLookup from "../helpers/helpers";
import path from "path";
import { parseFileUploadOptions } from "../utils/inputParser";


export class GCSProvider extends StorageProvider {
  private storage: Storage;
  private bucketName: string;
  private allowedFileTypes?: string[];

  constructor(
    private readonly gcsConfig: GCSConfig,
    private readonly cloudStorageConfig: CloudStorageConfig

) {
    super();
    this.bucketName = gcsConfig.bucketName;
    this.allowedFileTypes = cloudStorageConfig.allowedFileTypes;
    this.storage = new Storage({ credentials: gcsConfig.credentials });
  }

  public async upload(filePath: string, options?: FileUploadOptions): Promise<FileInfo> {
      const parsedOptions = parseFileUploadOptions(options);

    try {
         if (this.allowedFileTypes) {
      const mimeType = mimeLookup(filePath);
      if (!mimeType || !this.allowedFileTypes.includes(mimeType)) {
        throw new StorageError(`Invalid file type: ${mimeType}`);
      }
    }
      const destination = options?.destination || filePath.split("/").pop();
      const [file] = await this.storage.bucket(this.bucketName).upload(filePath, {
        destination,
        metadata: options?.metadata,
      });
      return {
        id: file.name,
        url: `https://storage.googleapis.com/${this.bucketName}/${file.name}`,
        provider: "gcs",
        metadata: file.metadata,
      };
    } catch (err: any) {
      throw new StorageError(`GCS upload failed: ${err.message}`, "GCS_UPLOAD_ERROR", err);
    }
  }

  public async uploadBulk(filePaths: string[], options?: FileUploadOptions): Promise<FileInfo[]> {
    return Promise.all(filePaths.map(filePath => this.upload(filePath, options)));
  }

  public async delete(fileId: string): Promise<void> {
    try {
      await this.storage.bucket(this.bucketName).file(fileId).delete();
    } catch (err: any) {
      throw new StorageError(`GCS delete failed: ${err.message}`, "GCS_DELETE_ERROR", err);
    }
  }

  public async deleteBulk(fileIds: string[]): Promise<void[]> {
    return Promise.all(fileIds.map(id => this.delete(id)));
  }

  public async createFolder(folderName: string): Promise<void> {
    try {
      await this.storage.bucket(this.bucketName).file(`${folderName.replace(/\/$/, "")}/.placeholder`).save("");
    } catch (err: any) {
      throw new StorageError(`GCS createFolder failed: ${err.message}`, "GCS_CREATEFOLDER_ERROR", err);
    }
  }
   public async uploadToFolder(
    folderName: string,
    filePath: string,
    options?: FileUploadOptions
  ): Promise<FileInfo> {
    const fileName = path.basename(options?.destination ?? filePath);
    const destination = `${folderName.replace(/\/$/, "")}/${fileName}`;
    return this.upload(filePath, { ...options, destination });
  }
}


