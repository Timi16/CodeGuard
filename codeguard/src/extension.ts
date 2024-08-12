import * as vscode from 'vscode';
import { analyzeSecrets } from './analyzers/secretAnalyzer';
import { analyzeAdvancedXSS } from './analyzers/xssAnalyzer';
import { analyzeAdvancedSQLInjection } from './analyzers/injectionAnalyzer';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "codeguard" is now active!');

    const analyzeSecretsCommand = vscode.commands.registerCommand('codeguard.analyzeSecrets', async () => {
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

    const analyzeXSSCommand = vscode.commands.registerCommand('codeguard.analyzeAdvancedXSS', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            try {
                await analyzeAdvancedXSS(editor.document.uri);
            } catch (error) {
                vscode.window.showErrorMessage('Failed to analyze XSS: ' + (error as Error).message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor detected.');
        }
    });

    const analyzeSQLInjectionCommand = vscode.commands.registerCommand('codeguard.analyzeAdvancedSQLInjection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            try {
                await analyzeAdvancedSQLInjection(editor.document.uri);
            } catch (error) {
                vscode.window.showErrorMessage('Failed to analyze SQL Injection: ' + (error as Error).message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor detected.');
        }
    });

    context.subscriptions.push(analyzeSecretsCommand);
    context.subscriptions.push(analyzeXSSCommand);
    context.subscriptions.push(analyzeSQLInjectionCommand);
}

export function deactivate() {}
