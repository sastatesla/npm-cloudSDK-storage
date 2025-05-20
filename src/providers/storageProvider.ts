import { FileUploadOptions, FileInfo } from "../types";

export abstract class StorageProvider {
  public abstract upload(filePath: string, options?: FileUploadOptions): Promise<FileInfo>;
  public abstract uploadBulk(filePaths: string[], options?: FileUploadOptions): Promise<FileInfo[]>;
  public abstract delete(fileId: string): Promise<void>;
  public abstract deleteBulk(fileIds: string[]): Promise<void[]>;
  public abstract createFolder(folderName: string): Promise<void>;
  public abstract uploadToFolder(
    folderName: string,
    filePath: string,
    options?: FileUploadOptions
  ): Promise<FileInfo>;
}