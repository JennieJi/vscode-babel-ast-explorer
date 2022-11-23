import * as vscode from 'vscode';
import { COMMANDS } from './commands';
import { OptionNode, OptionGroup } from './options';

class MultiOptionsProvider implements vscode.TreeDataProvider<OptionNode> {
  private model: OptionGroup;
  private enabledOptions: any[];
  private _onDidChangeTreeData: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData
    .event;

  constructor(optionGroup: OptionGroup, enabled?: any[]) {
    this.model = optionGroup;
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
            [this.model.key]: isEnabled
              ? enabled.filter((opt) => opt !== value)
              : [...enabled, value],
          },
        ],
        title: `Toggle ${label} option`,
      },
    };
  }

  public getChildren(): OptionNode[] | Thenable<OptionNode[]> {
    return this.model.items;
  }
}

export default MultiOptionsProvider;
