import { ParserOptions } from '@babel/parser';
import * as vscode from 'vscode';

export default function guessPlugins(
  editor: vscode.TextEditor | undefined
): ParserOptions['plugins'] {
  const lang = editor?.document.languageId;
  if (lang === 'javascriptreact') {
    return ['jsx'];
  } else if (lang === 'typescriptreact') {
    return ['typescript', 'jsx'];
  } else if (lang === 'typescript') {
    return ['typescript'];
  }
  return [];
}
