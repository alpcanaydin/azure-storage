import { NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AzureStorageOptions } from './azure-storage.service';
export declare function AzureStorageFileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
  azureStorageOptions?: Partial<AzureStorageOptions>,
): Type<NestInterceptor>;
