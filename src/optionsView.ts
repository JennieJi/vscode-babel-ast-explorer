import * as vscode from 'vscode';
import {
  OptionNode,
  PLUGINS,
  OPTIONS,
  IOptionGroup,
  IOptionItem,
  OptionGroups,
} from './options';
import fetch from 'node-fetch';
import MultiOptionsProvider from './MultiOptionsProvider';
import SingleOptionProvider from './SingleOptionProvider';



function fetchJson(url: string) {
  return fetch(url).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw `${res.status} ${res.statusText}`;
  })
}

const VERSION_LIMIT = 100;
const defaultVersionOption: IOptionItem = {
  type: 'option',
  label: 'latest',
  value: 'latest'
};
function getVersions(page = 1): Promise<string[]> {
  const url = `https://api.github.com/repos/babel/babel/tags?per_page=${VERSION_LIMIT}&page=${page}`;
  return fetchJson(url).then((res) => (res as { name: string }[]).map(tag => tag.name)).catch(e => {
    // TODO: find a better way to handle error
    console.error(e.toString());
    return [];
  });
}
function parseVersionOptions(versions: string[]) {
  const versionOptions: OptionGroups = [];
  versions.forEach((v) => {
    // @ts-ignore
    const [major, minor] = v.split('.');
    const groupValue = [major, minor].join('.');
    let last = versionOptions[versionOptions.length - 1];
    if (last?.label !== groupValue) {
      last = {
        type: 'group',
        label: groupValue,
        value: groupValue + '.',
        items: [],
      };
      versionOptions.push(last);
    }
    (last as IOptionGroup).items.push({
      type: 'option',
      label: v,
      value: v,
    });
  });
  return versionOptions;
}

class OptionsView {
  private viewers: {
    plugins?: {
      view: vscode.TreeView<OptionNode>;
      dataProvider: MultiOptionsProvider;
    };
    options?: {
      view: vscode.TreeView<OptionNode>;
      dataProvider: MultiOptionsProvider;
    };
    version?: {
      view: vscode.TreeView<OptionNode>;
      dataProvider: SingleOptionProvider;
    };
  } = {};

  constructor(initialVals = {} as { [key: string]: any }) {
    this.registerView(
      'plugins',
      new MultiOptionsProvider(
        'plugins',
        PLUGINS.map((plugin) => ({
          label: plugin as string,
          value: plugin,
        })),
        initialVals.plugins
      )
    );
    this.registerView(
      'options',
      new MultiOptionsProvider(
        'options',
        OPTIONS,
        initialVals.options
      )
    );

    this.registerView(
      'version',
      new SingleOptionProvider('version', [defaultVersionOption], defaultVersionOption.value)
    );
    this.loadVersions();
  }

  async loadVersions() {
    let loadedVersions: string[] = [];
    for (let p = 1; p < 5; p++) {
      const versions = await getVersions(p);
      loadedVersions = loadedVersions.concat(versions);
      this.viewers.version?.dataProvider.update([
        defaultVersionOption,
        ...parseVersionOptions(loadedVersions)
      ]);
    }
  }

  registerView(
    id: keyof OptionsView['viewers'],
    dataProvider: MultiOptionsProvider | SingleOptionProvider
  ) {
    this.viewers[id] = {
      view: vscode.window.createTreeView(`babelAstExplorer-${id}`, {
        treeDataProvider: dataProvider,
      }),
      // @ts-ignore
      dataProvider,
    };
  }

  update(options: { [key: string]: any }) {
    // @ts-ignore
    Object.keys(options).forEach((key) => this.viewers[key]?.dataProvider.setValue(options[key]));
  }

  dispose() {
    Object.values(this.viewers).forEach((viewer) => viewer.view.dispose());
  }
}
export default OptionsView;
