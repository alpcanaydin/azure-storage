"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AzureStorageModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const azure_multer_service_1 = require("./azure-multer.service");
const azure_storage_constant_1 = require("./azure-storage.constant");
const azure_storage_service_1 = require("./azure-storage.service");
const PUBLIC_PROVIDERS = [azure_multer_service_1.AzureMulterStorageService, azure_storage_service_1.AzureStorageService];
let AzureStorageModule = AzureStorageModule_1 = class AzureStorageModule {
    static withConfig(options) {
        return {
            module: AzureStorageModule_1,
            providers: [{ provide: azure_storage_constant_1.AZURE_STORAGE_MODULE_OPTIONS, useValue: options }],
        };
    }
};
AzureStorageModule = AzureStorageModule_1 = __decorate([
    common_1.Module({
        providers: [...PUBLIC_PROVIDERS],
        exports: [...PUBLIC_PROVIDERS, azure_storage_constant_1.AZURE_STORAGE_MODULE_OPTIONS],
    })
], AzureStorageModule);
exports.AzureStorageModule = AzureStorageModule;
