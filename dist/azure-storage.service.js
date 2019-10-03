"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Azure = require("@azure/storage-blob");
const common_1 = require("@nestjs/common");
const azure_storage_constant_1 = require("./azure-storage.constant");
exports.APP_NAME = 'AzureStorageService';
let AzureStorageService = class AzureStorageService {
    constructor(options) {
        this.options = options;
    }
    upload(file, perRequestOptions = null) {
        return __awaiter(this, void 0, void 0, function* () {
            perRequestOptions = Object.assign(Object.assign({}, this.options), perRequestOptions);
            if (!perRequestOptions.accountName) {
                throw new Error(`Error encountered: "AZURE_STORAGE_ACCOUNT" was not provided.`);
            }
            if (!perRequestOptions.sasKey) {
                throw new Error(`Error encountered: "AZURE_STORAGE_SAS_KEY" was not provided.`);
            }
            const { buffer, mimetype } = file;
            if (!buffer) {
                throw new Error(`Error encountered: File is not a valid Buffer (missing buffer property)`);
            }
            const url = this.getServiceUrl(perRequestOptions);
            const anonymousCredential = new Azure.AnonymousCredential();
            const pipeline = Azure.StorageURL.newPipeline(anonymousCredential);
            const serviceURL = new Azure.ServiceURL(url, pipeline);
            const containerURL = Azure.ContainerURL.fromServiceURL(serviceURL, perRequestOptions.containerName);
            let doesContainerExists = false;
            try {
                doesContainerExists = yield this._doesContainerExist(serviceURL, perRequestOptions.containerName);
            }
            catch (error) {
                if (error && error.statusCode) {
                    if (error.statusCode === 403) {
                        throw new Error(`Access denied for resource "${perRequestOptions.containerName}". Please check your "AZURE_STORAGE_SAS_KEY" key.`);
                    }
                    else {
                        throw new Error(`Error encountered: ${error.statusCode}`);
                    }
                }
                else if (error && error.code === 'REQUEST_SEND_ERROR') {
                    throw new Error(`Account not found: "${perRequestOptions.accountName}". Please check your "AZURE_STORAGE_ACCOUNT" value.`);
                }
                else {
                    throw new Error(error);
                }
            }
            if (doesContainerExists === false) {
                const createContainerResponse = yield containerURL.create(Azure.Aborter.none);
                common_1.Logger.log(`Container "${perRequestOptions.containerName}" created successfully`, exports.APP_NAME);
            }
            else {
                common_1.Logger.log(`Using container "${perRequestOptions.containerName}"`, exports.APP_NAME);
            }
            const blobName = file.originalname;
            const blobURL = Azure.BlobURL.fromContainerURL(containerURL, blobName);
            const blockBlobURL = Azure.BlockBlobURL.fromBlobURL(blobURL);
            try {
                const uploadBlobResponse = yield blockBlobURL.upload(Azure.Aborter.none, buffer, buffer.byteLength, {
                    blobHTTPHeaders: {
                        blobContentType: mimetype || 'application/octet-stream'
                    }
                });
                common_1.Logger.log(`Blob "${blobName}" uploaded successfully`, exports.APP_NAME);
            }
            catch (error) {
                throw new Error(error);
            }
            return blockBlobURL.url;
        });
    }
    getServiceUrl(perRequestOptions) {
        perRequestOptions.sasKey = perRequestOptions.sasKey.replace('?', '');
        return `https://${perRequestOptions.accountName}.blob.core.windows.net/?${perRequestOptions.sasKey}`;
    }
    _listContainers(serviceURL) {
        return __awaiter(this, void 0, void 0, function* () {
            let marker;
            const containers = [];
            do {
                const listContainersResponse = yield serviceURL.listContainersSegment(Azure.Aborter.none, marker);
                marker = listContainersResponse.nextMarker;
                for (const container of listContainersResponse.containerItems) {
                    containers.push(container.name);
                }
            } while (marker);
            return containers;
        });
    }
    _doesContainerExist(serviceURL, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._listContainers(serviceURL)).includes(name);
        });
    }
};
AzureStorageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(azure_storage_constant_1.AZURE_STORAGE_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], AzureStorageService);
exports.AzureStorageService = AzureStorageService;
