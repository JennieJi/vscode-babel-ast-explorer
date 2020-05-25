export type OptionNode = {
  label: string;
  value: any;
};
export type OptionGroup = {
  key: string;
  items: OptionNode[];
};

export const OPTIONS = [
  {
    value: 'no-empty',
    label: 'Hide empty',
  },
  {
    value: 'no-loc',
    label: 'Hide location',
  },
  {
    value: 'no-type',
    label: 'Hide types',
  },
];
export const PLUGINS: string[] = [
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
  'throwExpressions',
];
