import * as vscode from "vscode";
import * as path from "path";
import { resolveSearchWord } from "./wordUtils";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("aplf.gotoDefinition", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active, /[A-Za-z_][A-Za-z0-9_]*/);
    if (!wordRange) {
      return;
    }

    const word = resolveSearchWord(editor.document.getText(wordRange));
    const matches = await vscode.workspace.findFiles(`**/${word}.*`);

    if (matches.length === 0) {
      vscode.window.showInformationMessage(`No file found matching "${word}"`);
      return;
    }

    if (matches.length === 1) {
      await vscode.window.showTextDocument(matches[0]);
      return;
    }

    const items = matches.map((uri) => ({
      label: path.basename(uri.fsPath),
      description: vscode.workspace.asRelativePath(uri),
      uri,
    }));

    const picked = await vscode.window.showQuickPick(items, {
      placeHolder: `Multiple files match "${word}" — select one`,
    });

    if (picked) {
      await vscode.window.showTextDocument(picked.uri);
    }
  });

  context.subscriptions.push(disposable);

  const findUsageDisposable = vscode.commands.registerCommand("aplf.findUsage", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active, /[A-Za-z_][A-Za-z0-9_]*/);
    if (!wordRange) {
      return;
    }

    const word = editor.document.getText(wordRange);
    const folders: string[] = vscode.workspace.getConfiguration("aplf").get("findUsageFolders") ?? [];
    const includePattern = folders.length > 0 ? folders.map((f) => `${f}/**`).join(",") : "";

    await vscode.commands.executeCommand("workbench.action.findInFiles", {
      query: `(?<![A-Za-z0-9_])${word}(?![A-Za-z0-9_])`,
      isRegex: true,
      isCaseSensitive: true,
      matchWholeWord: false,
      filesToInclude: includePattern,
    });
  });

  context.subscriptions.push(findUsageDisposable);
}

export function deactivate() {}
