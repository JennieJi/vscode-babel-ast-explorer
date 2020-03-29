import * as vscode from 'vscode';
import * as path from 'path';
import { PLUGINS, OPTIONS } from './options';
import { COMMANDS } from './commands';

type OptionNode = {
  label: string;
  value: any;
  command?: COMMANDS;
};
type OptionGroup = {
  key: string;
  items: OptionNode[];
};

class MultiOptionsProvider implements vscode.TreeDataProvider<OptionNode> {
  private model: OptionGroup;
  private enabledOptions: any[];
  private _onDidChangeTreeData: vscode.EventEmitter<
    any
  > = new vscode.EventEmitter<any>();
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
      value.every(v => enabledOptionsSet.has(v))
    ) {
      return;
    }
    this.enabledOptions = value;
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem({ label, value, command }: OptionNode): vscode.TreeItem {
    const isEnabled = this.enabledOptions.includes(value);
    const enabled = this.enabledOptions;
    return {
      label,
      id: value,
      iconPath: path.resolve(
        __dirname,
        isEnabled ? 'icons/green-tick.svg' : 'icons/grey-tick.svg'
      ),
      command: {
        command: command || COMMANDS.update,
        arguments: [
          {
            [this.model.key]: isEnabled
              ? enabled.filter(opt => opt !== value)
              : [...enabled, value]
          }
        ],
        title: `Toggle ${label} option`
      }
    };
  }

  public getChildren(): OptionNode[] | Thenable<OptionNode[]> {
    return this.model.items;
  }
}
class SingleOptionProvider implements vscode.TreeDataProvider<OptionNode> {
  private model: OptionGroup;
  private enabled: any;
  private _onDidChangeTreeData: vscode.EventEmitter<
    any
  > = new vscode.EventEmitter<any>();
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
            [this.model.key]: this.enabled
          }
        ],
        title: `Toggle ${label} option`
      }
    };
  }

  public getChildren(): OptionNode[] | Thenable<OptionNode[]> {
    return this.model.items;
  }
}

class OptionsView {
  private viewers: {
    [id: string]: {
      view: vscode.TreeView<OptionNode>;
      dataProvider: MultiOptionsProvider | SingleOptionProvider;
    };
  };

  constructor(initialVals = {} as { [key: string]: any }) {
    this.viewers = {
      plugins: this.registerView(
        'babelAstExplorer-plugins',
        new MultiOptionsProvider(
          {
            key: 'plugins',
            items: PLUGINS.map(plugin => ({
              label: plugin as string,
              value: plugin
            }))
          },
          initialVals.plugins
        )
      ),
      options: this.registerView(
        'babelAstExplorer-options',
        new MultiOptionsProvider(
          {
            key: 'options',
            items: OPTIONS
          },
          initialVals.options
        )
      ),
      version: this.registerView(
        'babelAstExplorer-versions',
        new SingleOptionProvider(
          {
            key: 'version',
            items: [
              {
                label: '7.8.7',
                value: '7.8.7'
              }
            ]
          },
          '7.8.7'
        )
      )
    };
  }

  registerView(
    id: string,
    dataProvider: MultiOptionsProvider | SingleOptionProvider
  ) {
    return {
      view: vscode.window.createTreeView(id, {
        treeDataProvider: dataProvider
      }),
      dataProvider
    };
  }

  update(options: { [key: string]: any }) {
    Object.keys(options).forEach(key => {
      const viewer = this.viewers[key];
      if (viewer) {
        viewer.dataProvider.setValue(options[key]);
      }
    });
  }

  dispose() {
    Object.values(this.viewers).forEach(viewer => viewer.view.dispose());
  }
}
export default OptionsView;
