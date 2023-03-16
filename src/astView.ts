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

enum ACTION {
  SET_OPTIONS = 'SET_OPTIONS',
  HIGHLIGHT = 'HIGHLIGHT',
}

class ASTView {
  private panel: vscode.WebviewPanel;
  private editor: vscode.TextEditor | undefined;
  private debouncedUpdatePanel: (options?: ASTViewOptions) => void;

  private options = {
    sourceType: 'module',
  } as ASTViewOptions;

  constructor(onDispose?: () => void, options: ASTViewOptions = {}) {
    this.editor = vscode.window.activeTextEditor;
    this.options = {
      ...this.options,
      ...options
    };
    this.panel = vscode.window.createWebviewPanel(
      'babelAstExplorer',
      this.getTitle(),
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );
    this.debouncedUpdatePanel = debounce(() => this.updatePanel(), 500);
    this.updatePanel()
    const textEditorWatcher = vscode.window.onDidChangeTextEditorSelection(() => this.highlightSelected());

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
  public updateOptions(options: ASTViewOptions) {
    if (
      options.version !== this.options.version ||
      options.sourceType !== this.options.sourceType ||
      options.plugins?.toString() !== this.options.plugins?.toString()
    ) {
      return this.update(options);
    }
    if (options.options?.toString() !== this.options.options?.toString()) {
      this.options = {
        ...this.options,
        options: options.options
      };
      this.panel.webview.postMessage([ACTION.SET_OPTIONS, options.options]);
    }
  }

  private highlightSelected() {
    const lines = new Set<number>();
    this.editor?.selections.forEach(selection => {
      for (let n = selection.start.line; n <= selection.end.line; n++) {
        lines.add(n + 1);
      }
    });
    this.panel.webview.postMessage([ACTION.HIGHLIGHT, Array.from(lines)]);
  }

  private getTitle() {
    const sourcePath = this.editor?.document.fileName;
    if (sourcePath) {
      return `AST of ${vscode.workspace.asRelativePath(sourcePath)}`;
    } else {
      return 'Babel AST Explorer';
    }
  }

  private async updatePanel() {
    this.editor = vscode.window.activeTextEditor;
    this.panel.title = this.getTitle();
    this.panel.webview.html = 'Loading...';
    const content = await this.getWebviewContent();
    this.panel.webview.html = content ?? 'Error: empty content';
  }

  private async getWebviewContent() {
    const raw = this.editor?.document.getText() || '';
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
        class: options.join(' ')
      });
    } catch (e) {
      return (e as Error).message;
    }
  }
}

export default ASTView;
