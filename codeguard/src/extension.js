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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const secretAnalyzer_1 = require("./analyzers/secretAnalyzer");
// This method is called when your extension is activated
function activate(context) {
    console.log('Congratulations, your extension "codeguard" is now active!');
    // Register the "Analyze Code for Secrets" command
    const analyzeCommand = vscode.commands.registerCommand('codeguard.analyzeSecrets', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            try {
                await (0, secretAnalyzer_1.analyzeSecrets)(editor.document.uri);
            }
            catch (error) {
                vscode.window.showErrorMessage('Failed to analyze secrets: ' + error.message);
            }
        }
        else {
            vscode.window.showInformationMessage('No active editor detected.');
        }
    });
    // Register the "Hello World" command
    const helloWorldCommand = vscode.commands.registerCommand('codeguard.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from CodeGuard!');
    });
    // Add commands to the context subscriptions
    context.subscriptions.push(analyzeCommand);
    context.subscriptions.push(helloWorldCommand);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map