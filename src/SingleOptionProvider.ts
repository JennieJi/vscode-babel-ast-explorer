import * as vscode from 'vscode';
import * as path from 'path';
import { COMMANDS } from './commands';
import { OptionNode, OptionGroup } from './options';

class SingleOptionProvider implements vscode.TreeDataProvider<OptionNode> {
  private model: OptionGroup;
  private enabled: any;
  private _onDidChangeTreeData: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData
    .event;

  constructor(optionGroup: OptionGroup, enabled?: any) {
    this.model = optionGroup;
    this.enabled = enabled;
  }

  public setValue(value: string) {
    if (this.enabled !== value) {
      this.enabled = value;
      this._onDidChangeTreeData.fire();
    }
    return this.enabled;
  }

  public getTreeItem({ label, value }: OptionNode): vscode.TreeItem {
    const isEnabled = this.enabled === value;
    return {
      label,
      id: value,
      iconPath: path.resolve(
        __dirname,
        isEnabled ? 'icons/green-tick.svg' : 'icons/grey-tick.svg'
      ),
      command: {
        command: COMMANDS.update,
        arguments: [
          {
            [this.model.key]: value,
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

export default SingleOptionProvider;
