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
exports.analyzeSecrets = analyzeSecrets;
const vscode = __importStar(require("vscode"));
const securityUtils_1 = require("../utils/securityUtils");
async function analyzeSecrets(uri) {
    const content = await (0, securityUtils_1.getFileContents)(uri);
    const issues = [];
    const lines = content.split('\n');
    const patterns = await (0, securityUtils_1.getSecretPatterns)();
    // Analyze each line for secrets
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.pattern.exec(line)) !== null) {
                const diagnostic = new vscode.Diagnostic(new vscode.Range(i, match.index, i, match.index + match[0].length), `Misplaced secret detected: ${match[0]}`, vscode.DiagnosticSeverity.Warning);
                issues.push(diagnostic);
            }
        }
    }
    // Create a diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('secretAnalyzer');
    diagnosticCollection.set(uri, issues);
    // Show a summary message
    if (issues.length > 0) {
        vscode.window.showInformationMessage(`Secret analysis completed with ${issues.length} issues found.`);
    }
    else {
        vscode.window.showInformationMessage('No misplaced secrets found.');
    }
}
//# sourceMappingURL=secretAnalyzer.js.map