import * as vscode from 'vscode';
import {
  OptionNode,
  PLUGINS,
  OPTIONS,
  IOptionGroup,
  IOptionGroups,
} from './options';
import fetch from 'node-fetch';
import MultiOptionsProvider from './MultiOptionsProvider';
import SingleOptionProvider from './SingleOptionProvider';



function getVersions(): Promise<string[]> {
  return fetch('https://api.github.com/repos/babel/babel/tags').then(res => {
    if (res.ok) {
      return res.json();
    }
    throw `${res.status} ${res.statusText}`;
  }).then((res) => (res as { name: string }[]).map(tag => tag.name)).catch(e => {
    // TODO: find a better way to handle error
    console.error(e.toString());
    return [];
  });
}
function parseVersionOptions(versions: string[]) {
  const versionOptions: IOptionGroups = {};
  versions.forEach((v) =>
    // @ts-ignore
    v.split('.').reduce((obj, n, i, arr) => {
      if (arr.length === i + 1) {
        obj[n] = {
          type: 'option',
          // @ts-ignore
          label: v,
          // @ts-ignore
          value: v,
        };
        return obj;
      } else if (!obj[n]) {
        const groupValue = arr.slice(0, i + 1).join('.');
        obj[n] = {
          type: 'group',
          label: groupValue,
          value: groupValue,
          items: {},
        };
      }
      return (obj[n] as IOptionGroup).items;
    }, versionOptions)
  );
  return versionOptions;
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

    const defaultOptions: IOptionGroups = {
      latest: {
        type: 'option',
        label: 'latest',
        value: 'latest'
      }
    };
    this.viewers.version = this.registerView(
      'babelAstExplorer-versions',
      new SingleOptionProvider('version', defaultOptions, 'latest')
    );
    getVersions().then(parseVersionOptions).then(options => this.update({
      ...defaultOptions,
      ...options
    }));
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
