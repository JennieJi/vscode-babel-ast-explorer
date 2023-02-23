import * as vscode from 'vscode';
import { ParserOptions } from '@babel/parser';
import { resolveVersion } from './parserVersion';
import renderAst from './renderAst';
import simpleTemplate from './simpleTemplate';

export type ASTViewOptions = {
  version?: string;
  options?: string[];
  plugins?: ParserOptions['plugins'];
  sourceType?: ParserOptions['sourceType'];
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

  public updateEditor() {
    this.editor = vscode.window.activeTextEditor;
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
    const {
      version,
      sourceType,
      plugins,
      options = [],
    } = this.options || ({} as ASTViewOptions);

    try {
      const { parse } = await resolveVersion(version);
      const ast = parse(raw, {
        sourceType,
        plugins,
      });
      return simpleTemplate('index.html', {
        ast: await renderAst(ast),
        class: options.join(' '),
      });
    } catch (e) {
      return (e as Error).message;
    }
  }
}

export default ASTView;
