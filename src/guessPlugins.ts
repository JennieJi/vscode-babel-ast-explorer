import * as vscode from 'vscode';
import { ParserPlugin } from '@babel/parser';

export default function guessPlugins(
  editor: vscode.TextEditor | undefined
): ParserPlugin[] {
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
