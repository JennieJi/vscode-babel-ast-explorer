import * as vscode from 'vscode';
import ASTView, { ASTViewOptions } from './astView';
import OptionsView from './optionsView';
import { COMMANDS } from './commands';
import { OPTIONS } from './options';

export function activate(context: vscode.ExtensionContext) {
  let astView: ASTView | undefined;
  let optionsView: OptionsView | undefined;
  const defaultOptions = OPTIONS.map(({ value }) => value);
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.start, () => {
      if (!optionsView) {
        optionsView = new OptionsView({
          options: defaultOptions
        });
      }
      if (astView) {
        astView.updateEditor();
      } else {
        astView = new ASTView(
          () => {
            if (optionsView) {
              optionsView.dispose();
              optionsView = undefined;
            }
            astView = undefined;
          },
          { options: defaultOptions }
        );
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMANDS.update,
      (options: ASTViewOptions) => {
        if (astView) {
          astView.update(options);
        }
        if (optionsView) {
          optionsView.update(options);
        }
      }
    )
  );
}

export function deactivate() {}
