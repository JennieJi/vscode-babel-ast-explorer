import { parse, ParserPlugin } from '@babel/parser';
import renderAst from './renderAst';
import simpleTemplate from './simpleTemplate';

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
    plugins,
    versions,
    ast: await renderAst(ast)
  });
}
