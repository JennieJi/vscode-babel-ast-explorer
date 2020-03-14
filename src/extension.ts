import * as vscode from 'vscode';
import getWebviewContent from './getWebviewContent';

export function activate(context: vscode.ExtensionContext) {
  const start = vscode.commands.registerCommand(
    'babelAstExplorer.start',
    async () => {
      const panel = vscode.window.createWebviewPanel(
        'babelAstExplorer',
        'Babel AST Explorer',
        vscode.ViewColumn.Beside,
        {}
      );

      // vscode.window.activeTextEditor?.document.languageId

      panel.webview.html = await getWebviewContent(
        vscode.window.activeTextEditor?.document.getText() || ''
      );
    }
  );

  context.subscriptions.push(start);
}

export function deactivate() {}
