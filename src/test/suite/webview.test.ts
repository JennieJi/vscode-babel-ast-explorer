import * as assert from 'assert';
import getWebviewContent from '../../getWebviewContent';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import writeSnapshot from '../writeSnapshot';
import readSnapshot from '../readSnapshot';
// import * as myExtension from '../extension';

suite('Webview', () => {
  test('can work', async () => {
    const panel = vscode.window.createWebviewPanel(
      'babelAstExplorer',
      'Babel AST Explorer',
      vscode.ViewColumn.Beside,
      {}
    );
    const html = await getWebviewContent('import a from "module_a"');
    writeSnapshot(__filename, html, '.html');
    panel.webview.html = html;
    assert.equal(html, readSnapshot(__filename, '.html'));
  });
});
