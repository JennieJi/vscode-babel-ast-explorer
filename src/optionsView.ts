import * as vscode from 'vscode';
import { OptionNode, PLUGINS, OPTIONS } from './options';
import { getParserVersions } from './parserVersion';
import MultiOptionsProvider from './MultiOptionsProvider';
import SingleOptionProvider from './SingleOptionProvider';

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
            items: PLUGINS.map((plugin) => ({
              label: plugin as string,
              value: plugin,
            })),
          },
          initialVals.plugins
        )
      ),
      options: this.registerView(
        'babelAstExplorer-options',
        new MultiOptionsProvider(
          {
            key: 'options',
            items: OPTIONS,
          },
          initialVals.options
        )
      ),
    };

    const versions = getParserVersions();
    this.viewers.version = this.registerView(
      'babelAstExplorer-versions',
      new SingleOptionProvider(
        {
          key: 'version',
          items: versions.map((v) => ({
            label: v,
            value: v,
          })),
        },
        versions[0]
      )
    );
  }

  registerView(
    id: string,
    dataProvider: MultiOptionsProvider | SingleOptionProvider
  ) {
    return {
      view: vscode.window.createTreeView(id, {
        treeDataProvider: dataProvider,
      }),
      dataProvider,
    };
  }

  update(options: { [key: string]: any }) {
    Object.keys(options).forEach((key) => {
      const viewer = this.viewers[key];
      if (viewer) {
        viewer.dataProvider.setValue(options[key]);
      }
    });
  }

  dispose() {
    Object.values(this.viewers).forEach((viewer) => viewer.view.dispose());
  }
}
export default OptionsView;
