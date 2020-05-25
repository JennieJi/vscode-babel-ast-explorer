import * as vscode from 'vscode';

export default function guessPlugins(
  editor: vscode.TextEditor | undefined
): string[] {
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
