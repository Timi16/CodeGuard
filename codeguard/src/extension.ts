import * as vscode from 'vscode';
import { analyzeSecrets } from './analyzers/secretAnalyzer';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "codeguard" is now active!');

    // Register the "Analyze Code for Secrets" command
    const analyzeCommand = vscode.commands.registerCommand('codeguard.analyzeSecrets', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            try {
                await analyzeSecrets(editor.document.uri);
            } catch (error) {
                vscode.window.showErrorMessage('Failed to analyze secrets: ' + (error as Error).message);
            }
        } else {
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
export function deactivate() {}
