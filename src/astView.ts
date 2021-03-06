import * as vscode from 'vscode';
import renderAst from './renderAst';
import simpleTemplate from './simpleTemplate';
import { resolveVersion } from './parserVersion';

export type ASTViewOptions = {
  babelVersion?: string;
  options?: string[];
  plugins?: string[];
  sourceType?: string;
};

class ASTView {
  private panel: vscode.WebviewPanel;
  private editor: vscode.TextEditor | undefined;
  private codeVersion: number | undefined;
  private updateTimer?: NodeJS.Timeout;

  private options = {
    sourceType: 'module',
  } as ASTViewOptions;

  constructor(onDispose?: () => void, options?: ASTViewOptions) {
    this.editor = vscode.window.activeTextEditor;
    const sourcePath = this.editor?.document.uri;
    this.panel = vscode.window.createWebviewPanel(
      'babelAstExplorer',
      this.getTitle(),
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );
    if (onDispose) {
      this.panel.onDidDispose(onDispose);
    }
    this.update(options);
  }

  public update(options?: ASTViewOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    this.updatePanel();
    this.updateTimer = setTimeout(() => {
      if (this.getVersion() !== this.codeVersion) {
        this.updatePanel();
      }
    }, 10000);
  }

  public updateEditor(options?: ASTViewOptions) {
    this.editor = vscode.window.activeTextEditor;
    this.update(options);
  }

  private getTitle() {
    const sourcePath = this.editor?.document.fileName;
    if (sourcePath) {
      return `AST of ${vscode.workspace.asRelativePath(sourcePath)}`;
    } else {
      return 'Babel AST Explorer';
    }
  }

  private getContent() {
    return this.editor?.document.getText() || '';
  }
  private getVersion() {
    return this.editor?.document.version;
  }

  private async updatePanel() {
    this.panel.title = this.getTitle();
    this.panel.webview.html = 'Loading...';
    this.codeVersion = this.getVersion();
    const content = await this.getWebviewContent();
    if (content) {
      this.panel.webview.html = content;
    } else {
      this.panel.webview.html = 'Error: empty content';
    }
  }

  private async getWebviewContent() {
    const raw = this.getContent();
    const { babelVersion, sourceType, plugins, options = [] } =
      this.options || ({} as ASTViewOptions);

    try {
      const { parse } = resolveVersion(babelVersion);
      const ast = parse(raw, {
        sourceType,
        plugins,
      });
      return simpleTemplate('index.html', {
        ast: await renderAst(ast),
        class: options.join(' '),
      });
    } catch (e) {
      return e.message;
    }
  }
}

export default ASTView;
