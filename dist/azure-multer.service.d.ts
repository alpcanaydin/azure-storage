import { AzureStorageService } from './azure-storage.service';
export declare class AzureMulterStorageService {
  private readonly azureStorage;
  constructor(azureStorage: AzureStorageService);
  _handleFile(_req: any, file: any, cb: Function): Promise<void>;
  _removeFile(_req: any, file: any, cb: Function): void;
}
