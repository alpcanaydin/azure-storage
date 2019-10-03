/// <reference types="node" />
import { ServiceClientOptions } from '@azure/ms-rest-js';
export declare const APP_NAME = 'AzureStorageService';
export interface AzureStorageOptions {
  accountName: string;
  containerName: string;
  sasKey?: string;
  clientOptions?: ServiceClientOptions;
}
export interface UploadedFileMetadata {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: string;
  storageUrl?: string;
}
export declare class AzureStorageService {
  private readonly options;
  constructor(options: AzureStorageOptions);
  upload(
    file: UploadedFileMetadata,
    perRequestOptions?: Partial<AzureStorageOptions>,
  ): Promise<string | null>;
  getServiceUrl(perRequestOptions: Partial<AzureStorageOptions>): string;
  private _listContainers;
  private _doesContainerExist;
}
