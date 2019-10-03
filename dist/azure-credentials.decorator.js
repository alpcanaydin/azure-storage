"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.AzureCredentials = common_1.createParamDecorator((data, req) => {
    return {
        sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
        accountName: process.env['AZURE_STORAGE_ACCOUNT'],
    };
});
