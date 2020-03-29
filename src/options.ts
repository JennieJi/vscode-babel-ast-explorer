import { ParserPlugin } from '@babel/parser';

export const OPTIONS = [
  {
    value: 'no-empty',
    label: 'Hide empty'
  },
  {
    value: 'no-loc',
    label: 'Hide location'
  },
  {
    value: 'no-type',
    label: 'Hide types'
  }
];
export const PLUGINS: ParserPlugin[] = [
  'jsx',
  'flow',
  'typescript',
  'bigInt',
  'classProperties',
  'classPrivateProperties',
  'classPrivateMethods',
  'decorators',
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
];
