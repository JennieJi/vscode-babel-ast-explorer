import * as vscode from 'vscode';
import { COMMANDS } from './commands';
import { OptionNode } from './options';

class MultiOptionsProvider implements vscode.TreeDataProvider<OptionNode> {
  private key: string;
  private options: OptionNode[];
  private enabledOptions: any[];
  private _onDidChangeTreeData: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<any> =
    this._onDidChangeTreeData.event;

  constructor(key: string, options: OptionNode[], enabled?: any[]) {
    this.key = key;
    this.options = options;
    this.enabledOptions = enabled || [];
  }

  public setValue(value: any[]) {
    const enabledOptionsSet = new Set(this.enabledOptions);
    if (
      this.enabledOptions.length === value.length &&
      value.every((v) => enabledOptionsSet.has(v))
    ) {
      return;
    }
    this.enabledOptions = value;
    this._onDidChangeTreeData.fire();
  }

  public update(options: OptionNode[]) {
    this.options = options;
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem({ label, value }: OptionNode): vscode.TreeItem {
    const isEnabled = this.enabledOptions.includes(value);
    const enabled = this.enabledOptions;
    return {
      label,
      id: value,
      iconPath: isEnabled
        ? new vscode.ThemeIcon('notebook-state-success')
        : undefined,
      command: {
        command: COMMANDS.update,
        arguments: [
          {
            [this.key]: isEnabled
              ? enabled.filter((opt) => opt !== value)
              : [...enabled, value],
          },
        ],
        title: `Toggle ${label} option`,
      },
    };
  }

  public getChildren(): OptionNode[] | Thenable<OptionNode[]> {
    return this.options;
  }
}

export default MultiOptionsProvider;
