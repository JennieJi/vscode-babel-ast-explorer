import { Node } from '@babel/types';
import simpleTemplate from './simpleTemplate';

export default async function renderAst(ast: Node): Promise<string> {
  const ret = await Promise.all(
    Object.entries(ast).map(async ([key, node]: [string, Node]) => {
      const isArrayNode =
        node && typeof node === 'object' && (node as any).length === 'number';
      const isEmpty =
        !node ||
        (isArrayNode && !(node as any).length) ||
        (typeof node === 'object' && !Object.keys(node).length);
      let childType = typeof node as string;
      if (node === null) {
        childType = 'null';
      } else if (isArrayNode) {
        childType = 'array';
      }

      let child = '';
      if (node && typeof node === 'object') {
        child = await renderAst(node);
      } else {
        child = '' + node;
      }

      return simpleTemplate('node.html', {
        key,
        type: node?.type || '',
        child,
        childType,
        line: '' + (node?.loc?.start.line || ''),
        colStart: typeof node?.start === 'number' ? '' + node?.start : '',
        colEnd: typeof node?.end === 'number' ? '' + node?.end : '',
        class: isEmpty ? `empty` : '',
      });
    })
  );
  return ret.join('\n');
}
