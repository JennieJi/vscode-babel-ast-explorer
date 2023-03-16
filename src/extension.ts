import * as vscode from 'vscode';
import ASTView, { ASTViewOptions } from './astView';
import OptionsView from './optionsView';
import { COMMANDS } from './commands';
import { OPTIONS } from './options';
import guessPlugins from './guessPlugins';

export function activate(context: vscode.ExtensionContext) {
  let astView: ASTView | undefined;
  const defaultOptions = OPTIONS.map(({ value }) => value);
  const optionsView = new OptionsView({
    options: defaultOptions
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.start, () => {
      const plugins = guessPlugins(vscode.window.activeTextEditor);
      optionsView.update({ plugins });
      if (astView) {
        astView.update({ plugins });
      } else {
        astView = new ASTView(
          () => {
            optionsView.dispose();
          },
          { options: defaultOptions, plugins }
        );
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMANDS.update,
      (options: ASTViewOptions) => {
        optionsView.update(options);
        if (astView) {
          astView.update(options);
        }
      }
    )
  );
}

export function deactivate() { }
