import * as vscode from 'vscode';
import { getFileContents } from '../utils/securityUtils';

export async function analyzeAdvancedXSS(uri: vscode.Uri) {
    const content = await getFileContents(uri);
    const issues: vscode.Diagnostic[] = [];

    // Context-sensitive patterns for XSS detection
    const xssPatterns = [
        { context: 'HTML', pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi },
        { context: 'HTML', pattern: /<[^>]+on\w+\s*=\s*['"].*['"]/gi },
        { context: 'JavaScript', pattern: /document\.write\(/gi },
        { context: 'JavaScript', pattern: /eval\(/gi },
        { context: 'JavaScript', pattern: /innerHTML\s*=\s*['"].*['"]/gi },
        { context: 'URL', pattern: /href\s*=\s*['"]javascript:.*['"]/gi }
    ];

    const lines = content.split('\n');

    // Iterate through lines and patterns
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (const { context, pattern } of xssPatterns) {
            let match;
            while ((match = pattern.exec(line)) !== null) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, match.index, i, match.index + match[0].length),
                    `Potential XSS vulnerability in ${context} context: ${match[0]}`,
                    vscode.DiagnosticSeverity.Warning
                );
                issues.push(diagnostic);
            }
        }

        // Check if user input is being directly inserted into HTML/JavaScript without sanitization
        if (/(\${.*?})|(\+\s*['"].*['"])/.test(line)) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(i, 0, i, line.length),
                `Potential unsafe user input usage detected: ${line.trim()}`,
                vscode.DiagnosticSeverity.Warning
            );
            issues.push(diagnostic);
        }
    }

    // Create a diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('advancedXSSAnalyzer');
    diagnosticCollection.set(uri, issues);

    // Show a summary message
    if (issues.length > 0) {
        vscode.window.showInformationMessage(`Advanced XSS analysis completed with ${issues.length} issues found.`);
    } else {
        vscode.window.showInformationMessage('No advanced XSS vulnerabilities found.');
    }
}
