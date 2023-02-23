export type OptionNode = {
  label: string;
  value: any;
};
export interface IOptionItem {
  type: 'option';
  label: string;
  value: string;
}
export interface IOptionGroup {
  type: 'group';
  label: string;
  value: string;
  items: OptionGroups;
}
export type OptionGroups = (IOptionGroup | IOptionItem)[]

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
  'flowComments',
  'typescript',
  'v8intrinsic',
  'asyncDoExpressions',
  'decimal',
  'decorators',
  'decoratorAutoAccessors',
  'destructuringPrivate',
  'doExpressions',
  'explicitResourceManagement',
  'exportDefaultFrom',
  'functionBind',
  'functionSent',
  'importAssertions',
  'importReflection',
  'moduleBlocks',
  'partialApplication',
  'pipelineOperator',
  'recordAndTuple',
  'regexpUnicodeSets',
  'throwExpressions',
  'asyncGenerators',
  'bigInt',
  'classProperties',
  'classPrivateProperties',
  'classPrivateMethods',
  'classStaticBlock',
  'dynamicImport',
  'exportNamespaceFrom',
  'logicalAssignment',
  'moduleStringNames',
  'nullishCoalescingOperator',
  'numericSeparator',
  'objectRestSpread',
  'optionalChaining',
  'optionalCatchBinding',
  'privateIn',
  'topLevelAwait'
];
