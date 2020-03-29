import * as vscode from 'vscode';
import { parse, ParserPlugin, ParserOptions } from '@babel/parser';
import renderAst from './renderAst';
import simpleTemplate from './simpleTemplate';

export type ASTViewOptions = ParserOptions & {
  babelVersion?: string;
  options?: string[];
};

class ASTView {
  private panel: vscode.WebviewPanel;
  private editor: vscode.TextEditor | undefined;
  private codeVersion: number | undefined;
  private updateTimer?: NodeJS.Timeout;

  private options = {
    sourceType: 'module'
  } as ASTViewOptions;

  constructor(onDispose?: () => void, options?: ASTViewOptions) {
    this.editor = vscode.window.activeTextEditor;
    const sourcePath = this.editor?.document.uri;
    this.panel = vscode.window.createWebviewPanel(
      'babelAstExplorer',
      this.getTitle(),
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
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
    this.update();
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
    this.panel.webview.html = await this.getWebviewContent();
    this.codeVersion = this.getVersion();
  }

  private async getWebviewContent() {
    const raw = this.getContent();
    const { sourceType, plugins, options = [] } =
      this.options || ({} as ASTViewOptions);

    try {
      const ast = parse(raw, {
        sourceType,
        plugins
      });
      return simpleTemplate('index.html', {
        ast: await renderAst(ast),
        class: options.join(' ')
      });
    } catch (e) {
      return e.message;
    }
  }
}

export default ASTView;
