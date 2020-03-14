import { parse, ParserPlugin } from '@babel/parser';
import renderAst from './renderAst';
import simpleTemplate from './simpleTemplate';
import renderRepeated from './renderRepeated';

const PLUGINS = [
  'jsx',
  'flow',
  'typescript',
  'bigInt',
  'classProperties',
  'classPrivateProperties',
  'classPrivateMethods',
  'decorators - legacy',
  'decoratorsBeforeExport',
  'decorators',
  'decoratorsBeforeExport',
  'doExpressions',
  'dynamicImport',
  'exportDefaultFrom',
  'nullishCoalescingOperator',
  'numericSeparator',
  'objectRestSpread',
  'optionalChaining',
  'optionalCatchBinding',
  'partialApplication',
  'pipelineOperator',
  'throwExpressions'
].map(plugin => ({
  value: plugin as ParserPlugin,
  label: plugin
}));
const OPTIONS = [
  {
    value: 'no-empty',
    label: 'Hide empty',
    attributes: 'checked'
  },
  {
    value: 'no-loc',
    label: 'Hide location',
    attributes: 'checked'
  },
  {
    value: 'no-type',
    label: 'Hide types',
    attributes: 'checked'
  }
];

export default async function getWebviewContent(
  raw: string,
  {
    plugins,
    version
  }: {
    plugins?: ParserPlugin[];
    version?: string;
  } = {}
) {
  const ast = parse(raw, {
    sourceType: 'module',
    plugins
  });
  const versions = [] as string[];
  return simpleTemplate('index.html', {
    title: 'Babel AST Explorer',
    version,
    plugins: await renderRepeated(
      'option.html',
      PLUGINS.map(p => ({
        ...p,
        attributes: plugins?.includes(p.value) ? 'checked' : ''
      }))
    ),
    options: await renderRepeated('option.html', OPTIONS),
    versions,
    ast: await renderAst(ast)
  });
}
