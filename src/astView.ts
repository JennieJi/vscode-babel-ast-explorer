import * as vscode from 'vscode';
import { ParserOptions } from '@babel/parser';
import debounce from 'lodash.debounce';
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
  private debouncedUpdatePanel: (options?: ASTViewOptions) => void;

  private options = {
    sourceType: 'module',
  } as ASTViewOptions;

  constructor(onDispose?: () => void, options?: ASTViewOptions) {
    this.editor = vscode.window.activeTextEditor;
    this.panel = vscode.window.createWebviewPanel(
      'babelAstExplorer',
      this.getTitle(),
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );
    this.debouncedUpdatePanel = debounce(this.updatePanel, 500);
    if (onDispose) {
      this.panel.onDidDispose(onDispose);
    }
    this.update(options);
    const textEditorWatcher = vscode.window.onDidChangeTextEditorSelection(() => this.update());
    this.panel.onDidDispose(() => {
      textEditorWatcher.dispose();
      if (onDispose) {
        onDispose();
      }
    });
  }
  public update(options?: ASTViewOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
    this.debouncedUpdatePanel();
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

  private async updatePanel() {
    this.panel.title = this.getTitle();
    this.panel.webview.html = 'Loading...';
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
      const lines = new Set<number>();
      this.editor?.selections.forEach(selection => {
        for (let n = selection.start.line; n <= selection.end.line; n++) {
          lines.add(n + 1);
        }
      });
      return simpleTemplate('index.html', {
        ast: await renderAst(ast),
        class: options.join(' '),
        style: Array.from(lines).map(l => `.line-${l}`).join(',') + '{ background: lightyellow; }'
      });
    } catch (e) {
      return (e as Error).message;
    }
  }
}

export default ASTView;
