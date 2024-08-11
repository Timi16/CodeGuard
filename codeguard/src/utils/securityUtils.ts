import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

// Define a type for secret detection patterns
export type SecretPattern = {
    name: string;
    pattern: RegExp;
};

// Get the file contents as a string
export async function getFileContents(uri: vscode.Uri): Promise<string> {
    const filePath = uri.fsPath;
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Get the patterns for detecting secrets
export async function getSecretPatterns(): Promise<SecretPattern[]> {
    // Return hardcoded patterns
    return [
        { name: 'API Key', pattern: /API_KEY\s*=\s*['"].+['"]/g },
        { name: 'Secret Key', pattern: /SECRET_KEY\s*=\s*['"].+['"]/g },
        { name: 'Password', pattern: /password\s*=\s*['"].+['"]/g },
        { name: 'Token', pattern: /token\s*=\s*['"].+['"]/g },
        // Add more patterns as needed
    ];
}
