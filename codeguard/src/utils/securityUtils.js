"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileContents = getFileContents;
exports.getSecretPatterns = getSecretPatterns;
const fs = __importStar(require("fs"));
// Get the file contents as a string
async function getFileContents(uri) {
    const filePath = uri.fsPath;
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
// Get the patterns for detecting secrets
async function getSecretPatterns() {
    // Return hardcoded patterns
    return [
        { name: 'API Key', pattern: /API_KEY\s*=\s*['"].+['"]/g },
        { name: 'Secret Key', pattern: /SECRET_KEY\s*=\s*['"].+['"]/g },
        { name: 'Password', pattern: /password\s*=\s*['"].+['"]/g },
        { name: 'Token', pattern: /token\s*=\s*['"].+['"]/g },
        // Add more patterns as needed
    ];
}
//# sourceMappingURL=securityUtils.js.map