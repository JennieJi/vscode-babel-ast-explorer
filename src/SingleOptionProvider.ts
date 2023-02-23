import * as vscode from 'vscode';
import { COMMANDS } from './commands';
import {
  OptionNode,
  OptionGroups,
  IOptionGroup,
  IOptionItem,
} from './options';

class SingleOptionProvider implements vscode.TreeDataProvider<OptionNode> {
  private key: string;
  private model: OptionGroups;
  private enabled: any;
  private _onDidChangeTreeData: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<any> =
    this._onDidChangeTreeData.event;

  constructor(key: string, optionGroup: OptionGroups, enabled?: any) {
    this.key = key;
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

  public update(optionGroup: OptionGroups) {
    this.model = optionGroup;
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(item: IOptionGroup | IOptionItem): vscode.TreeItem {
    const { type, label, value } = item;
    const isEnabled = this.enabled === value || this.enabled.startsWith(value);
    if (type === 'group') {
      return {
        label,
        id: value,
        collapsibleState: isEnabled + 1,
      };
    }
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
            [this.key]: value,
          },
        ],
        title: `Toggle ${label} option`,
      },
    };
  }

  public getChildren(
    el: IOptionGroup | undefined
  ): OptionGroups {
    return el ? el.items : this.model;
  }
}

export default SingleOptionProvider;
