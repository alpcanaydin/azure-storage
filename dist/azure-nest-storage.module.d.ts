import { DynamicModule } from '@nestjs/common';
import { AzureStorageOptions } from './azure-storage.service';
export declare class AzureStorageModule {
  static withConfig(options: AzureStorageOptions): DynamicModule;
}
