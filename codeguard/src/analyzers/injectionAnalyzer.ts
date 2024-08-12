import * as vscode from 'vscode';
import { getFileContents } from '../utils/securityUtils';

export async function analyzeAdvancedSQLInjection(uri: vscode.Uri) {
    const content = await getFileContents(uri);
    const issues: vscode.Diagnostic[] = [];

    // Patterns to detect potentially unsafe SQL query constructions
    const sqlInjectionPatterns = [
        /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*=.*\s+('|").*\1\s*;/gi,
        /INSERT\s+INTO\s+.*\s+VALUES\s+\(.*\)\s*;/gi,
        /UPDATE\s+.*\s+SET\s+.*=.*\s+('|").*\1\s*WHERE\s+.*=.*\s*;/gi,
        /DELETE\s+FROM\s+.*\s+WHERE\s+.*=.*\s+('|").*\1\s*;/gi
    ];

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (const pattern of sqlInjectionPatterns) {
            let match;
            while ((match = pattern.exec(line)) !== null) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, match.index, i, match.index + match[0].length),
                    `Potential SQL injection vulnerability: ${match[0]}`,
                    vscode.DiagnosticSeverity.Warning
                );
                issues.push(diagnostic);
            }
        }

        // Check if the query is parameterized (absence of hard-coded input in queries)
        if (/\${.*?}/.test(line)) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(i, 0, i, line.length),
                `Potentially unsafe dynamic SQL query detected: ${line.trim()}`,
                vscode.DiagnosticSeverity.Warning
            );
            issues.push(diagnostic);
        }
    }

    // Create a diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('advancedSQLInjectionAnalyzer');
    diagnosticCollection.set(uri, issues);

    // Show a summary message
    if (issues.length > 0) {
        vscode.window.showInformationMessage(`Advanced SQL Injection analysis completed with ${issues.length} issues found.`);
    } else {
        vscode.window.showInformationMessage('No advanced SQL Injection vulnerabilities found.');
    }
}
