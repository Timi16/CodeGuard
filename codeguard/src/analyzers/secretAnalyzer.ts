import * as vscode from 'vscode';
import { getFileContents, getSecretPatterns } from '../utils/securityUtils';

export async function analyzeSecrets(uri: vscode.Uri) {
    const content = await getFileContents(uri);
    const issues: vscode.Diagnostic[] = [];

    const lines = content.split('\n');
    const patterns = await getSecretPatterns();

    // Analyze each line for secrets
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.pattern.exec(line)) !== null) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, match.index, i, match.index + match[0].length),
                    `Misplaced secret detected: ${match[0]}`,
                    vscode.DiagnosticSeverity.Warning
                );
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
    } else {
        vscode.window.showInformationMessage('No misplaced secrets found.');
    }
}
